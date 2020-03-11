const Controller = require("egg").Controller;

class CommentController extends Controller {
  /**
   * @description 查询评论列表
   * @memberof CommentCtrl
   */
  async list() {
    const { helper, request, response, service } = this.ctx;
    const { valueId, typeId, size, page = 1 } = helper.validateParams(
      {
        valueId: { type: "numberString", field: "valueId" },
        typeId: { type: "numberString", field: "typeId" },
        size: { type: "numberString", field: "size" },
        page: { type: "numberString", required: false, field: "page" },
        // // 选择评论的类型 0 全部， 1 只显示图片
        showType: { type: "numberString", required: false, field: "showType" }
      },
      request.query,
      this.ctx
    );

    const { count, rows } = await service.api.comment.listAndCount(
      { type_id: typeId, value_id: valueId },
      page,
      size
    );

    // 最后返回的评论列表
    const commentList = [];
    for (const commentItem of rows) {
      const comment = {};
      comment.content = Buffer.from(commentItem.content, "base64").toString();
      comment.type_id = commentItem.type_id;
      comment.value_id = commentItem.value_id;
      comment.id = commentItem.value_id;
      comment.add_time = new Date(commentItem.add_time * 1000);

      const [userInfo, picList] = await Promise.all([
        service.api.user.find({ id: commentItem.user_id }, [
          "username",
          "avatar",
          "nickname"
        ]),
        service.api.commentPicture.list({ comment_id: commentItem.id })
      ]);

      comment.user_info = userInfo;
      comment.pic_list = picList;
      commentList.push(comment);
    }

    response.body = {
      count,
      totalPages: helper.pageTotal(count, size),
      pageSize: size,
      currentPage: page,
      data: commentList
    };
  }

  /**
   * @description 查询某个货物的评论总数
   * @memberof CommentCtrl
   */
  async count() {
    const { helper, request, response, model, service } = this.ctx;
    const { valueId, typeId } = helper.validateParams(
      {
        valueId: { type: "numberString", field: "valueId" },
        typeId: { type: "numberString", field: "typeId" }
      },
      request.query,
      this.ctx
    );

    const allCount = await model.Comment.count({
      where: { type_id: typeId, value_id: valueId },
      col: "id"
    });

    // sequelizejs 默认只有left join与inner join，需要right join的时候，只能调换表的位置，把right join改为 left join
    // 任然无法满足需求的时候，只能自己拆分多次查表
    const comments = await service.api.comment.list(
      { type_id: typeId, value_id: valueId },
      0,
      0,
      [],
      ["id"]
    );

    const hasPicCount = await model.CommentPicture.count({
      where: { comment_id: { [Op.in]: comments.map(comment => comment.id) } },
      col: "comment_id"
    });

    response.body = {
      allCount,
      hasPicCount
    };
  }

  /**
   * @description 添加评论帖子
   * @memberof CommentCtrl
   */
  async addPost() {
    const { request, helper, service, response, jwtSession } = this.ctx;
    const { content, typeId, valueId } = helper.validateParams(
      {
        content: { type: "string" },
        typeId: { type: "number" },
        valueId: { type: "number" }
      },
      request.body,
      this.ctx
    );

    await service.api.comment.save({
      type_id: typeId,
      value_id: valueId,
      content: Buffer.from(content).toString("base64"),
      add_time: Date.now() / 1000,
      user_id: jwtSession.user_id
    });

    response.body = "评论添加成功";
  }
}
module.exports = CommentController;
