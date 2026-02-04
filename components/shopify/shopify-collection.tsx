"use client";

import { useEffect } from "react";

interface ShopifyCollectionProps {
  collectionId: string;
  domain: string;
  storefrontAccessToken: string;
  moneyFormat?: string;
  className?: string;
}

export default function ShopifyCollection({
  collectionId,
  domain,
  storefrontAccessToken,
  moneyFormat = "%C2%A3%7B%7Bamount%7D%7D",
  className = "",
}: ShopifyCollectionProps) {
  useEffect(() => {
    const scriptURL =
      "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js";

    const loadScript = () => {
      const script = document.createElement("script");
      script.async = true;
      script.src = scriptURL;
      script.onload = initializeShopifyBuy;
      (
        document.getElementsByTagName("head")[0] ||
        document.getElementsByTagName("body")[0]
      ).appendChild(script);
    };

    const initializeShopifyBuy = () => {
      if (typeof window !== "undefined" && (window as any).ShopifyBuy) {
        const client = (window as any).ShopifyBuy.buildClient({
          domain,
          storefrontAccessToken,
        });

        (window as any).ShopifyBuy.UI.onReady(client).then((ui: any) => {
          const containerId = `collection-component-${collectionId}`;
          const container = document.getElementById(containerId);

          if (container) {
            ui.createComponent("collection", {
              id: collectionId,
              node: container,
              moneyFormat,
              options: {
                product: {
                  styles: {
                    product: {
                      "@media (min-width: 601px)": {
                        "max-width": "calc(25% - 20px)",
                        "margin-left": "20px",
                        "margin-bottom": "50px",
                        width: "calc(25% - 20px)",
                      },
                      img: {
                        height: "calc(100% - 15px)",
                        position: "absolute",
                        left: "0",
                        right: "0",
                        top: "0",
                      },
                      imgWrapper: {
                        "padding-top": "calc(75% + 15px)",
                        position: "relative",
                        height: "0",
                      },
                    },
                    button: {
                      color: "#fcf6f6",
                      ":hover": {
                        color: "#fcf6f6",
                        "background-color": "#180202",
                      },
                      "background-color": "#0e0101",
                      ":focus": {
                        "background-color": "#180202",
                      },
                    },
                  },
                  text: {
                    button: "Add to cart",
                  },
                },
                productSet: {
                  styles: {
                    products: {
                      "@media (min-width: 601px)": {
                        "margin-left": "-20px",
                      },
                    },
                  },
                },
                modalProduct: {
                  contents: {
                    img: false,
                    imgWithCarousel: true,
                    button: false,
                    buttonWithQuantity: true,
                  },
                  styles: {
                    product: {
                      "@media (min-width: 601px)": {
                        "max-width": "100%",
                        "margin-left": "0px",
                        "margin-bottom": "0px",
                      },
                    },
                    button: {
                      color: "#fcf6f6",
                      ":hover": {
                        color: "#fcf6f6",
                        "background-color": "#180202",
                      },
                      "background-color": "#0e0101",
                      ":focus": {
                        "background-color": "#180202",
                      },
                    },
                  },
                  text: {
                    button: "Add to cart",
                  },
                },
                option: {},
                cart: {
                  styles: {
                    button: {
                      color: "#fcf6f6",
                      ":hover": {
                        color: "#fcf6f6",
                        "background-color": "#180202",
                      },
                      "background-color": "#0e0101",
                      ":focus": {
                        "background-color": "#180202",
                      },
                    },
                  },
                  text: {
                    total: "Subtotal",
                    button: "Checkout",
                  },
                },
                toggle: {
                  styles: {
                    toggle: {
                      "background-color": "#0e0101",
                      ":hover": {
                        "background-color": "#180202",
                      },
                      ":focus": {
                        "background-color": "#180202",
                      },
                    },
                    count: {
                      color: "#fcf6f6",
                      ":hover": {
                        color: "#fcf6f6",
                      },
                    },
                    iconPath: {
                      fill: "#fcf6f6",
                    },
                  },
                },
              },
            });
          }
        });
      }
    };

    // Check if ShopifyBuy is already loaded
    if (typeof window !== "undefined") {
      if ((window as any).ShopifyBuy) {
        if ((window as any).ShopifyBuy.UI) {
          initializeShopifyBuy();
        } else {
          loadScript();
        }
      } else {
        loadScript();
      }
    }
  }, [collectionId, domain, storefrontAccessToken, moneyFormat]);

  return (
    
      <div className="mb-12">
        <h2 className="text-2xl font-light tracking-tight text-gray-900 mb-6">
          Featured Collection
        </h2>
        <ShopifyCollection
          collectionId="677459460441"
          domain="i2zhw1-yp.myshopify.com"
          storefrontAccessToken="d60527deb542a695bb1fb4f7db838dcc"
          moneyFormat="%C2%A3%7B%7Bamount%7D%7D"
          className="min-h-[400px]"
        />
      </div>
  );
}