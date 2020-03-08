const BaseService=require('../base')

class CartService extends BaseService {
  constructor(app) {
    super('Cart', app);
  }

  async count() {
    return (await this.getCart()).cartTotal.goodsCount;
  }

  async getCart() {
    // NOTE: 需要做会话控制：如果会话不存在，则写死userid为1
    const { ctx } = this;
    console.log('userid', ctx.session.userid);
    const cartList =
      (await ctx.service.api.carts.list({
        user_id: ctx.session.userid || 1,
      })) || [];
    console.log(cartList);
    // 购物车统计信息
    // 购车中中货物总数
    let goodsCount = 0;
    // 购物车中零售价总价
    let goodsAmount = 0.0;
    let checkedGoodsCount = 0;
    let checkedGoodsAmount = 0.0;

    for (const cartItem of cartList) {
      goodsCount += cartItem.number;
      goodsAmount += cartItem.number * cartItem.retail_price;
      if (cartItem.checked) {
        checkedGoodsCount += cartItem.number;
        checkedGoodsAmount += cartItem.number * cartItem.retail_price;
      }

      // NOTE: 已经有商品图片了，源码这里为什么还要查找商品的图片？？
      // cartItem.list_pic_url = await model.Good.find({
      //   where: { id: cartItem.goods_id },
      //   attributes: ['list_pic_url'],
      //   raw: true,
      // }).then(res => res.list_pic_url);
    }

    return {
      cartList,
      cartTotal: {
        goodsCount,
        goodsAmount,
        checkedGoodsCount,
        checkedGoodsAmount,
      },
    };
  }
}
module.exports=CartService