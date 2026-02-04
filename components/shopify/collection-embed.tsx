"use client"

import { useEffect } from "react"

declare global {
  interface Window {
    ShopifyBuy?: any
  }
}

export default function ShopifyCollectionEmbed() {
  useEffect(() => {
    const scriptURL = "https://sdks.shopifycdn.com/buy-button/latest/buy-button-storefront.min.js"

    function loadScript() {
      const script = document.createElement("script")
      script.async = true
      script.src = scriptURL
      const target = document.getElementsByTagName("head")[0] || document.body
      target.appendChild(script)
      script.onload = ShopifyBuyInit
    }

    function ShopifyBuyInit() {
      if (!window.ShopifyBuy || !window.ShopifyBuy.UI) return

      const client = window.ShopifyBuy.buildClient({
        domain: "i2zhw1-yp.myshopify.com",
        storefrontAccessToken: "d60527deb542a695bb1fb4f7db838dcc",
      })

      window.ShopifyBuy.UI.onReady(client).then((ui: any) => {
        ui.createComponent("collection", {
          id: "677459460441",
          node: document.getElementById("collection-component-1757075350433"),
          moneyFormat: "%C2%A3%7B%7Bamount%7D%7D",
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
        })
      })
    }

    if (window.ShopifyBuy) {
      if (window.ShopifyBuy.UI) {
        ShopifyBuyInit()
      } else {
        loadScript()
      }
    } else {
      loadScript()
    }
  }, [])

  return <div id="collection-component-1757075350433" />
}
