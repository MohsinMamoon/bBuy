const rules = {
  visitor: {
    static: [
    "register:register"
    ]
  },
  buyer: {
    static: [
      "store:view",
      "orders:visit",
      "sellerDetails:view",
      "productDetails:view",
      "buyerProduct:get",
    ],
    dynamic: {
      // "posts:edit": ({userId, postOwnerId}) => {
      //   if (!userId || !postOwnerId) return false;
      //   return userId === postOwnerId;
      // }
    }
  },
  seller: {
    static: [
      "product:add",
      "sellerDetails:view",
      "sellerProduct:view",
      "productDetails:view",
      "sellerProduct:get",
      "navigate:seller"
    ],
    dynamic: {
    }
  }
};

export default rules;