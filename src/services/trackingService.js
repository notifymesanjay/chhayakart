import appConstant from "../components/appConstant";

class TrackingService {
	constructor() {
		this.appConstant = appConstant;
	}

	trackCart(product, totalQuantity, userEmail) {
		var deviceType = this.getDeviceType(window.navigator.userAgent);
		var totalAmount =
			product.variants && product.variants.length > 0
				? product.variants[0].discounted_price * totalQuantity
				: product.discounted_price
				? product.discounted_price * totalQuantity
				: 0;

		if (window.dataLayer) {
			window.dataLayer.push({
				event: "add_to_cart",
				ecommerce: {
					currency: "INR",
					value: totalAmount,
					item_id: product.id,
							item_name: product.name,
							price: totalAmount / totalQuantity,
							amount: totalAmount,
							currency: "INR",
							item_category: product.category_id,
							title: product.name,
							quantity: totalQuantity,
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

	trackHomePage(userEmail) {
		var deviceType = this.getDeviceType(window.navigator.userAgent);

		if (window.dataLayer) {
			window.dataLayer.push({
				event: "homepage_tracking",
				site: deviceType,
				page_title: "homepage",
				page_path: "/",
				email: userEmail,
			});
		}
	}

	trackProductPage(productId, productName, categoryId, userEmail) {
		var deviceType = this.getDeviceType(window.navigator.userAgent);

		if (window.dataLayer) {
			window.dataLayer.push({
				event: "product_page",
				site: deviceType,
				product_name: productName,
				product_id: productId,
				category_id: categoryId,
				email: userEmail,
			});
		}
	}

	trackSubCategory(subCategoryId, userEmail) {
		var deviceType = this.getDeviceType(window.navigator.userAgent);

		if (window.dataLayer) {
			window.dataLayer.push({
				event: "subCategory_page",
				site: deviceType,
				subCategory_id: subCategoryId,
				email: userEmail,
			});
		}
	}

	initiateCheckout(order, userEmail) {
		var deviceType = this.getDeviceType(window.navigator.userAgent);

		if (window.dataLayer) {
			window.dataLayer.push({
				event: "begin_checkout",
				ecommerce: {
					currency: "INR",
					value: order.total_amount,
					email: userEmail ? userEmail : "", // Can be an empty string
					site: deviceType,
					checkout: {
						actionField: {
							taxes: order.taxes,
							amount: order.total_amount,
							subTotal: order.sub_total,
							delivery_charge: order.delivery_charge.total_delivery_charge,
						},
						products: [
							{
								taxes: order.taxes,
								amount: order.total_amount,
								subTotal: order.sub_total,
								quantity: order.quantity,
								product_variants: order.product_variant_id,
								discount: order.discount,
								delivery_charge: order.delivery_charge.total_delivery_charge,
							},
						],
					},
				},
				eventCallback: function () {},
			});
		}
	}

	checkout(order, userEmail) {
		var deviceType = this.getDeviceType(window.navigator.userAgent);

		if (window.dataLayer) {
			window.dataLayer.push({
				event: "view_checkout",
				ecommerce: {
					currency: "INR",
					value: order.total_amount,
					email: userEmail ? userEmail : "", // Can be an empty string
					site: deviceType,
					checkout: {
						actionField: {
							taxes: order.taxes,
							amount: order.total_amount,
							subTotal: order.sub_total,
							delivery_charge: order.delivery_charge.total_delivery_charge,
						},
						products: [
							{
								taxes: order.taxes,
								amount: order.total_amount,
								subTotal: order.sub_total,
								quantity: order.quantity,
								product_variants: order.product_variant_id,
								discount: order.discount,
								delivery_charge: order.delivery_charge.total_delivery_charge,
							},
						],
					},
				},
				eventCallback: function () {},
			});
		}
	}

	paymentSuccess(order, type, data, userEmail) {
		var deviceType = this.getDeviceType(window.navigator.userAgent);
		if (window.dataLayer) {
			window.dataLayer.push({
				event: "purchase",
				ecommerce: {
					value: order.total_amount,
					email: userEmail,
					currency: "INR",
					transaction_id:data!=undefined && data!=null? data.order_id:"",
					product_id:order.product_variant_id
				},
				amount: order.total_amount,
				email: userEmail,
				currency: "INR",
				payment_type: type,
				transactionId: data!=undefined && data!=null? data.order_id:"",
				site: deviceType,
			});
		}
	}

	viewCart(order, userEmail) {
		var deviceType = this.getDeviceType(window.navigator.userAgent);
		if (window.dataLayer) {
			window.dataLayer.push({
				event: "view_cart",
				ecommerce: {
					currency: "INR",
					value: parseInt(order.discounted_price) * parseInt(order.qty),
					items: [
						{
							item_id: order.product_id,
							item_name: order.name,
							price: order.discounted_price,
							amount: parseInt(order.discounted_price) * parseInt(order.qty),
							currency: "INR",
							title: order.name,
							product_variant: order.product_variant_id,
							quantity: order.qty,
						},
					],
					email: userEmail ? userEmail : "", // Can be an empty string
					site: deviceType,
				},
				eventCallback: function () {},
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
