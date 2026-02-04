"use client"

import { useEffect } from "react"
import Image from "next/image"
import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import { useCart } from "./cart-context"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"

export default function CartModal({ isOpen, setIsOpen }: { isOpen: boolean; setIsOpen: (isOpen: boolean) => void }) {
  const { cart, total, updateQuantity, removeFromCart } = useCart()
  const router = useRouter()

  // Close modal when pressing escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("keydown", handleEscape)
    }

    return () => {
      document.removeEventListener("keydown", handleEscape)
    }
  }, [isOpen, setIsOpen])

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  const handleCheckout = () => {
    // Store current path for redirect after login if needed
    localStorage.setItem("loginReturnUrl", "/checkout")
    router.push("/checkout")
    setIsOpen(false)
  }

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.3, delay: 0.1 },
    },
  }

  const drawerVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      x: "100%",
      transition: {
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: custom * 0.1,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      },
    }),
  }

  const buttonVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.95,
      transition: { duration: 0.1 },
    },
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex">
            <motion.div
              className="relative w-screen max-w-md"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              <div className="h-full flex flex-col bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-6 border-b border-gray-200 bg-black text-white">
                  <h2 className="text-lg font-medium tracking-wide">Your Bag</h2>
                  <motion.button
                    className="text-white hover:text-gray-300 cursor-hover"
                    onClick={() => setIsOpen(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={24} />
                    <span className="sr-only">Close</span>
                  </motion.button>
                </div>

                {/* Cart items */}
                <div className="flex-1 overflow-y-auto py-6 px-6">
                  {cart.length === 0 ? (
                    <motion.div
                      className="flex flex-col items-center justify-center h-full"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <ShoppingBag size={64} className="text-gray-300 mb-6" />
                      <p className="text-gray-500 text-lg">Your bag is empty</p>
                      <motion.button
                        className="mt-6 bg-black text-white px-8 py-3 font-medium tracking-wider uppercase hover:bg-gray-800 transition-colors cursor-hover"
                        onClick={() => setIsOpen(false)}
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                      >
                        Continue Shopping
                      </motion.button>
                    </motion.div>
                  ) : (
                    <ul className="divide-y divide-gray-200">
                      {cart.map((item, index) => (
                        <motion.li
                          key={item.variantId}
                          className="py-6 flex"
                          custom={index}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                        >
                          <div className="flex-shrink-0 w-24 h-24 border border-gray-200 overflow-hidden">
                            <Image
                              src={item.image || "/placeholder.svg"}
                              alt={item.title}
                              width={96}
                              height={96}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          <div className="ml-4 flex-1 flex flex-col">
                            <div>
                              <div className="flex justify-between text-base font-medium text-gray-900">
                                <h3 className="pr-6">{item.title}</h3>
                                <p className="ml-4">£{(Number.parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                              </div>
                              {item.variantTitle && item.variantTitle !== "Default Title" && (
                                <p className="mt-1 text-sm text-gray-500">{item.variantTitle}</p>
                              )}
                            </div>

                            <div className="flex-1 flex items-end justify-between text-sm pt-2">
                              <div className="flex items-center border border-gray-300">
                                <motion.button
                                  className="p-1 text-gray-600 hover:text-gray-900 cursor-hover"
                                  onClick={() => {
                                    if (item.quantity > 1) {
                                      updateQuantity(item.variantId, item.quantity - 1)
                                    }
                                  }}
                                  aria-label="Decrease quantity"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  disabled={item.quantity <= 1}
                                >
                                  <Minus size={14} />
                                </motion.button>
                                <span className="px-3 py-1 text-center w-8">{item.quantity}</span>
                                <motion.button
                                  className="p-1 text-gray-600 hover:text-gray-900 cursor-hover"
                                  onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                                  aria-label="Increase quantity"
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <Plus size={14} />
                                </motion.button>
                              </div>

                              <motion.button
                                type="button"
                                className="font-medium text-black hover:text-gray-600 transition-colors cursor-hover"
                                onClick={() => removeFromCart(item.variantId)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                Remove
                              </motion.button>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                  <div className="border-t border-gray-200 py-6 px-6 bg-black text-white">
                    <div className="flex justify-between text-lg font-medium mb-6">
                      <p>Subtotal</p>
                      <p>£{total.toFixed(2)}</p>
                    </div>
                    <div className="mb-6">
                      <label htmlFor="discount" className="block text-sm font-medium mb-2">
                        Discount code
                      </label>
                      <div className="flex">
                        <input
                          type="text"
                          id="discount"
                          name="discount"
                          className="flex-1 border border-gray-600 bg-transparent text-white px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent transition-all duration-300"
                          placeholder="Enter code"
                        />
                        <motion.button
                          className="ml-3 bg-white text-black px-6 py-3 text-sm font-medium hover:bg-gray-200 transition-colors cursor-hover"
                          variants={buttonVariants}
                          whileHover="hover"
                          whileTap="tap"
                        >
                          Apply
                        </motion.button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mb-6">Shipping and taxes calculated at checkout.</p>
                    <div className="mb-4">
                      <p className="text-sm">
                        <span className="font-medium">Order today</span> to get by{" "}
                        {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString(undefined, {
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                      <p className="text-sm mt-1">Returns & exchanges accepted within 30 days</p>
                    </div>
                    <motion.button
                      onClick={handleCheckout}
                      className="w-full bg-white text-black py-4 px-6 flex items-center justify-center font-medium tracking-wider uppercase hover:bg-gray-200 transition-colors cursor-hover"
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      Checkout
                    </motion.button>
                    <div className="mt-4">
                      <motion.button
                        className="w-full text-center text-sm text-gray-300 hover:text-white cursor-hover"
                        onClick={() => setIsOpen(false)}
                        whileHover={{ scale: 1.02 }}
                      >
                        Continue Shopping
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}
