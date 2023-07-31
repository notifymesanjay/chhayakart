import appConstant from "../components/appConstant";

class TrackingService {
  constructor() {
    this.appConstant = appConstant;
  }

  trackCart(product, totalQuantity, userEmail) {
    var deviceType = this.getDeviceType(window.navigator.userAgent);
    var totalAmount =
      product.variants.length > 0
        ? product.variants[0].discounted_price * totalQuantity
        : 0;

    if (window.dataLayer) {
      window.dataLayer.push({
        event: "add_to_cart",
        ecommerce: {
          currency: "INR",
          value: totalAmount,
          items: [
            {
              item_id: product.id,
              item_name: product.name,
              price: totalAmount / totalQuantity,
              amount: totalAmount,
              currency: "INR",
              item_category: product.category_id,
              title: product.name,
              quantity: totalQuantity,
            },
          ],
          email: userEmail ? userEmail : "", // Can be an empty string
          site: deviceType,
        },
      });
    }
  }

  getDeviceType(userAgent) {
    return /iPad/.test(userAgent)
      ? "t"
      : /Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Silk/.test(userAgent)
      ? "m"
      : "d";
  }
}

export default TrackingService;
