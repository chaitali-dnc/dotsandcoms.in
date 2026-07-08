import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import InnerBanner from "../components/ui/InnerBanner";
import paymentMethodsImg from "../assets/images/payment-methods.png";

export default function WebHostingDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state;

  const [paymentMethod, setPaymentMethod] = useState("Master Card");
  const [isSuccess, setIsSuccess] = useState(false);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = "Web Hosting Order Details | Dots & Coms";
  }, []);

  if (!state) {
    return (
      <div className="min-h-[60vh] bg-white flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-bold text-slate-800">No Active Order Session</h2>
          <p className="text-sm text-slate-500">
            We couldn't find any pending order details. Please fill out the configuration form first.
          </p>
          <button
            onClick={() => navigate("/order-now")}
            className="inline-flex items-center gap-2 bg-[#dc2626] text-white font-bold py-2 px-6 rounded hover:bg-red-700 transition"
          >
            Go to Order Now
          </button>
        </div>
      </div>
    );
  }

  // Extract variables from form state
  const {
    orderId,
    packageName,
    packagePrice,
    packagePeriod,
    domainName,
    companyName,
    yourName,
    emailId,
    contactNumber,
    address,
    city,
    state: orderState,
    areaCode,
    country,
    comments,
    totalPrice,
    isServerPlan,
    serverName,
    operatingSystem,
    paymentTerm,
    controlPanelOption,
    setupCharge,
    dbAddonPrice = 0,
    discount = 0
  } = state;

  // Clean package name for receipt view (e.g. "Silver Pack")
  const displayName = packageName.replace("Web Hosting - ", "");

  // Prices
  const baseCost = packagePrice;
  const sqlCost = dbAddonPrice;
  const panelCost = isServerPlan ? (parseInt(controlPanelOption) * (parseInt(paymentTerm) || 1)) : 0;
  const setupCost = setupCharge || 0;
  const discountCost = discount || 0;

  // Totals
  const totalCost = totalPrice; // Already computed in form
  const gstRate = 0.18;
  const gstAmount = Math.round(totalCost * gstRate * 100) / 100;
  const grandTotal = Math.round((totalCost + gstAmount) * 100) / 100;

  const handleFinalSubmit = (e) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      navigate("/thank-you", {
        state: {
          orderId,
          packageName,
          grandTotal,
          paymentMethod,
          emailId,
          domainName,
          serverName,
          isServerPlan
        }
      });
    }, 1200);
  };

  return (
    <>
      <InnerBanner
        title="Web Hosting Order Details"
        subtitle="Review your configuration, billing information, and proceed with payment."
        breadcrumbs={[
          { label: "Web Hosting", href: "/windows-web-hosting-service-provider-baroda" },
          { label: "Order Now", href: "/order-now" },
          { label: "Order Details" }
        ]}
      />
      <div className="bg-white min-h-screen py-16 px-6 sm:px-12 md:px-24 text-slate-900 font-sans">
        <div className="max-w-3xl mx-auto space-y-8 text-base md:text-lg leading-relaxed">
        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.form
              key="payment-form"
              onSubmit={handleFinalSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              {/* Package Choosed Header */}
              <div>
                <p className="font-extrabold text-black">
                  Package you choosed : <span className="font-black text-slate-900">{displayName}</span> Price: ₹ {packagePrice} per {packagePeriod}
                </p>
              </div>

              {/* Domain Name / Server Name */}
              <div>
                <p className="font-bold text-slate-800">
                  {isServerPlan ? "Server Name:" : "Domain Name:"}
                  <span className="font-extrabold text-black ml-4">
                    {isServerPlan ? serverName : domainName}
                  </span>
                </p>
                {isServerPlan && (
                  <p className="font-bold text-slate-800 mt-1">
                    Operating System:
                    <span className="font-extrabold text-black ml-4">{operatingSystem}</span>
                  </p>
                )}
              </div>

              {/* Billing Information Section */}
              <div className="space-y-2 pt-2">
                <h3 className="font-black text-black text-lg border-b border-slate-200 pb-1 mb-3">
                  Billing Information:
                </h3>

                <div className="space-y-1.5">
                  <p className="text-slate-700">
                    Company Name: <span className="font-extrabold text-black ml-2">{companyName}</span>
                  </p>
                  <p className="text-slate-700">
                    Your Name: <span className="font-extrabold text-black ml-2">{yourName}</span>
                  </p>
                  <p className="text-slate-700">
                    Email ID: <span className="font-extrabold text-black ml-2">{emailId}</span>
                  </p>
                  <p className="text-slate-700">
                    Contact Number: <span className="font-extrabold text-black ml-2">{contactNumber}</span>
                  </p>
                  <p className="text-slate-700">
                    Address: <span className="font-extrabold text-black ml-2">{address}</span>
                  </p>
                  <p className="text-slate-700">
                    City: <span className="font-extrabold text-black ml-2">{city}</span>
                  </p>
                  <p className="text-slate-700">
                    State: <span className="font-extrabold text-black ml-2">{orderState}</span>
                  </p>
                  
                  {!isServerPlan && areaCode && (
                    <p className="text-slate-700">
                      Area Code: <span className="font-extrabold text-black ml-2">{areaCode}</span>
                    </p>
                  )}

                  <p className="text-slate-700">
                    Country: <span className="font-extrabold text-black ml-2">{country}</span>
                  </p>
                  <p className="text-slate-700">
                    Comments: <span className="font-extrabold text-black ml-2">{comments || "N/A"}</span>
                  </p>
                </div>
              </div>

              {/* Price Details Breakdown */}
              <div className="space-y-1.5 pt-4 border-t border-slate-100">
                <p className="text-slate-700">
                  {displayName}: <span className="font-extrabold text-black ml-2">₹ {baseCost.toFixed(2)}</span>
                </p>

                {isServerPlan && panelCost > 0 && (
                  <p className="text-slate-700">
                    Control Panel: <span className="font-extrabold text-black ml-2">₹ {panelCost.toFixed(2)}</span>
                  </p>
                )}

                {!isServerPlan && (
                  <p className="text-slate-700">
                    SQL 2012 Database Support: <span className="font-extrabold text-black ml-2">₹ {sqlCost.toFixed(2)}</span>
                  </p>
                )}

                {setupCost > 0 && (
                  <p className="text-slate-700">
                    Setup Charge: <span className="font-extrabold text-black ml-2">₹ {setupCost.toFixed(2)}</span>
                  </p>
                )}

                {discountCost > 0 && (
                  <p className="text-emerald-700">
                    Discount: <span className="font-extrabold ml-2">-₹ {discountCost.toFixed(2)}</span>
                  </p>
                )}

                <p className="text-slate-700">
                  Total: <span className="font-extrabold text-black ml-2">₹ {totalCost.toFixed(2)}</span>
                </p>
                <p className="text-slate-700">
                  GST (18%) : <span className="font-extrabold text-black ml-2">₹ {gstAmount.toFixed(2)}</span>
                </p>
                <p className="font-extrabold text-black">
                  Grand Total: <span className="font-black text-black ml-2">₹ {grandTotal.toFixed(2)}</span>
                </p>
              </div>

              {/* Payment Methods Section */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="font-bold text-slate-800">
                  Payment methods:
                </h3>

                {/* Display Payment Logos Image */}
                <div className="my-2 max-w-lg">
                  <img 
                    src={paymentMethodsImg} 
                    alt="Payment Gateway Logos" 
                    className="w-full h-auto object-contain"
                  />
                </div>

                {/* Radio selections */}
                <div className="flex flex-col sm:flex-row gap-6 pt-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Master Card"
                      checked={paymentMethod === "Master Card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-[#dc2626] focus:ring-red-500 border-slate-350"
                    />
                    <span className="text-sm font-semibold text-slate-800">Master Card</span>
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="Visa"
                      checked={paymentMethod === "Visa"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-[#dc2626] focus:ring-red-500 border-slate-350"
                    />
                    <span className="text-sm font-semibold text-slate-800">Visa</span>
                  </label>

                  <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="NetBanking"
                      checked={paymentMethod === "NetBanking"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-4 h-4 text-[#dc2626] focus:ring-red-500 border-slate-350"
                    />
                    <span className="text-sm font-semibold text-slate-800">NetBanking</span>
                  </label>
                </div>
              </div>

              {/* Submit button (exactly matching screenshot's red rectangle styling) */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={processing}
                  className="bg-[#dc2626] hover:bg-red-700 text-white font-bold py-3.5 px-8 rounded shadow transition cursor-pointer text-sm uppercase tracking-wider font-heading"
                >
                  {processing ? "Processing..." : "Submit"}
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              key="success-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl border border-slate-100 p-8 sm:p-12 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto text-green-500">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-850 font-heading">Order Placed Successfully!</h2>
                <p className="text-sm text-slate-500 max-w-md mx-auto">
                  Thank you for ordering with Dots & Coms. We have received your order details and will setup your server/domain hosting shortly.
                </p>
              </div>

              <div className="bg-slate-50 rounded-xl p-6 max-w-md mx-auto border border-slate-150 space-y-3 text-left">
                <div className="flex justify-between text-xs text-slate-400 font-semibold uppercase tracking-wider">
                  <span>Order Reference</span>
                  <span>Plan Details</span>
                </div>
                <div className="flex justify-between text-slate-850 font-bold">
                  <span className="font-mono text-base text-[#dc2626]">{orderId}</span>
                  <span className="text-sm">{displayName}</span>
                </div>
                <div className="w-full h-[1px] bg-slate-200" />
                <div className="flex justify-between items-center text-xs text-slate-505">
                  <span>Total Amount due:</span>
                  <span className="font-mono font-bold text-slate-850 text-sm">₹{grandTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs text-slate-505">
                  <span>Payment Gateway:</span>
                  <span className="font-bold text-slate-700">{paymentMethod}</span>
                </div>
              </div>

              <p className="text-xs text-slate-400">
                Our deployment desk will contact you via email at <strong className="text-slate-650">{emailId}</strong> to complete server verification and payment processing.
              </p>

              <div className="pt-4">
                <button
                  onClick={() => navigate("/windows-web-hosting-service-provider-baroda")}
                  className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold px-6 py-3 rounded-lg text-sm transition-all duration-250 shadow-md cursor-pointer"
                >
                  Back to Hosting Solutions
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </>
  );
}
