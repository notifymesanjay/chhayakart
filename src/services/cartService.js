import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import TrackingService from "./trackingService";

export const AddProductToCart = (product, quantity) => {
	let cart = JSON.parse(localStorage.getItem("cart"));
	if (!cart) {
		let updatedProductList = [
			{
				cod_allowed: "1",
				discounted_price: product.variants[0].discounted_price,
				image_url: product.image_url,
				is_deliverable: product.is_deliverable ? 1 : 0,
				is_unlimited_stock: product.variants[0].is_unlimited_stock,
				name: product.name,
				price: product.variants[0].price,
				product_id: product.id,
				product_variant_id: product.variants[0].id,
				qty: quantity != null ? quantity : 1,
				status: product.status,
				stock: product.variants[0].stock,
				taxable_amount: product.variants[0].taxable_amount,
				total_allowed_quantity: product.total_allowed_quantity,
				unit: product.variants[0].stock_unit,
			},
		];
		localStorage.setItem("cart", JSON.stringify(updatedProductList));
		return true;
	} else {
		const existingproduct = cart.find((prod) => prod.product_id === product.id);
		console.log("xtr", existingproduct);
		let flag = true;
		if (existingproduct) {
			for (let prod of cart) {
				if (
					prod.product_id === product.id &&
					parseInt(quantity) <= parseInt(prod.total_allowed_quantity)
				) {
					prod.qty = quantity;
				} else if (
					prod.product_id === product.id &&
					parseInt(quantity) > parseInt(prod.total_allowed_quantity)
				) {
					toast.error("Maximum Quantity Exceeded");
					flag = false;
				}
			}
			localStorage.setItem("cart", JSON.stringify(cart));
			return flag;
		} else {
			let updatedProductList = [...cart];
			updatedProductList.push({
				cod_allowed: "1",
				discounted_price: product.variants[0].discounted_price,
				image_url: product.image_url,
				is_deliverable: product.is_deliverable ? 1 : 0,
				is_unlimited_stock: product.variants[0].is_unlimited_stock,
				name: product.name,
				price: product.variants[0].price,
				product_id: product.id,
				product_variant_id: product.variants[0].id,
				qty: quantity != null ? quantity : 1,
				status: product.status,
				stock: product.variants[0].stock,
				taxable_amount: product.variants[0].taxable_amount,
				total_allowed_quantity: product.total_allowed_quantity,
				unit: product.variants[0].stock_unit,
			});
			localStorage.setItem("cart", JSON.stringify(updatedProductList));
			return true;
		}
	}
};

export const IncrementProduct = (
	product_id,
	product,
	quantity,
	isBulkOrder = false
) => {
	let cart = JSON.parse(localStorage.getItem("cart"));
	console.log("xyz1", cart);
	let flag = 0;
	if (cart) {
		for (let prod of cart) {
			if (!isBulkOrder) {
				if (parseInt(prod.product_id) === parseInt(product_id)) {
					if (
						parseInt(prod.qty) + parseInt(quantity) <=
						parseInt(prod.total_allowed_quantity)
					) {
						prod.qty = parseInt(prod.qty) + parseInt(quantity);
						flag = 1;
					} else {
						toast.error("Maximum Quantity Exceeded");
					}
				}
			} else {
				if (parseInt(prod.product_id) === parseInt(product_id)) {
					if (parseInt(quantity) <= parseInt(prod.total_allowed_quantity)) {
						prod.qty = parseInt(quantity);
						flag = 1;
					} else {
						toast.error("Maximum Quantity Exceeded");
					}
				}
			}
		}
	}
	localStorage.setItem("cart", JSON.stringify(cart));
	return flag === 1;
};

export const DecrementProduct = (product_id, product) => {
	let cart = JSON.parse(localStorage.getItem("cart"));
	let flag = 0;
	if (cart) {
		for (let i = 0; i < cart.length; i++) {
			if (cart[i].product_id === product_id) {
				if (cart[i].qty - 1 > 0) {
					cart[i].qty -= 1;
					flag = 1;
				} else if (cart[i].qty - 1 === 0) {
					cart.splice(i, 1);
				}
			}
		}
	}
	localStorage.setItem("cart", JSON.stringify(cart));
	return flag === 1;
};

export const DeleteProductFromCart = (product_id) => {
	let cart = JSON.parse(localStorage.getItem("cart"));
	let i = 0;
	if (cart) {
		while (i < cart.length) {
			if (cart[i].product_id === product_id) {
				cart.splice(i, 1);
			}
			i++;
		}
	}
	localStorage.setItem("cart", JSON.stringify(cart));
	return 1;
};
