import  { useState } from "react";
import { Phone, Send, User, AtSign, Globe, Building2, MessageSquare } from "lucide-react";
import ReCAPTCHA from "react-google-recaptcha";
import axios from "axios";
import { useRef } from "react";
/* ============================================================
   1) FloatingField — compact input wrapper with floating label
   ============================================================ */
function FloatingField({ icon: Icon, label, type = "text", required, value, onChange, textarea = false }) {
    const [focused, setFocused] = useState(false);
    const hasValue = value && value.length > 0;
    const floated = focused || hasValue;
   
 
    const Tag = textarea ? "textarea" : "input";
   
    return (
        <div className="relative">
            {Icon && (
                <Icon
                    size={16}
                    className={`absolute left-3.5 z-10 text-slate-400 transition-all duration-200 ${textarea ? "top-3.5" : "top-1/2 -translate-y-1/2"
                        }`}
                />
            )}
            <Tag
                type={textarea ? undefined : type}
                required={required}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                rows={textarea ? 3 : undefined}
                placeholder=" "
                className={`w-full rounded-lg border border-slate-200 bg-slate-50/60 pl-9 pr-3 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 transition-all duration-200 ${textarea ? "pt-6 pb-2 resize-none" : "pt-5 pb-1 h-12"
                    }`}
            />
            <span
                className={`absolute left-9 pointer-events-none text-slate-400 transition-all duration-200 ${floated
                    ? "top-1 text-[10px] font-medium text-[#dc2626]"
                    : `text-sm ${textarea ? "top-3.5" : "top-1/2 -translate-y-1/2"}`
                    }`}
            >
                {label} {required && <span className="text-[#dc2626]">*</span>}
            </span>
        </div>
    );
}

/* ============================================================
   2) Captcha — simple math captcha (illustrative, swap as needed)
   ============================================================ */
//function Captcha({ value, onChange }) {
//    const [a] = useState(() => Math.ceil(Math.random() * 8) + 1);
//    const [b] = useState(() => Math.ceil(Math.random() * 8) + 1);
//    return (
//        <div className="flex items-center gap-2.5">
//            <div className="flex items-center justify-center px-4 h-12 rounded-lg bg-slate-800 text-white text-sm font-semibold tracking-widest select-none whitespace-nowrap">
//                {a} + {b} = ?
//            </div>
//            <input
//                type="text"
//                value={value}
//                onChange={(e) => onChange(e.target.value)}
//                placeholder="Answer"
//                className="flex-1 h-12 rounded-lg border border-slate-200 bg-slate-50/60 px-3.5 text-sm text-slate-800 outline-none focus:bg-white focus:border-[#dc2626] focus:ring-2 focus:ring-red-100 transition-all duration-200"
//            />
//        </div>
//    );
//}

/* ============================================================
   3) ContactForm — the main message form (compact, floating labels)
   ============================================================ */
export function ContactForm() {
    const [form, setForm] = useState({
        name: "", email: "", phone: "", country: "", city: "", message: "",
    });
 
    const [error, setError] = useState("");
    const captchaRef = useRef(null);
    const [submitted, setSubmitted] = useState(false);
    const [captchaToken, setCaptchaToken] = useState("");
    const API_URL = "https://localhost:7248/api/Contact/send";
    const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

   const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if(!captchaToken)
    {
        setError("Please verify the captcha.");

        return;
    }

    try{

        await axios.post(API_URL,{

            name:form.name,

            email:form.email,

            phone:form.phone,

            country:form.country,

            city:form.city,

            message:form.message,

            recaptchaToken:captchaToken

        });

        setSubmitted(true);
        setTimeout(() => {

            setSubmitted(false);

        }, 3000);

        setForm({

            name:"",
            email:"",
            phone:"",
            country:"",
            city:"",
            message:""

        });

        captchaRef.current?.reset();
        setCaptchaToken("");

    }

    catch (error) {

        console.log(error.response?.data);

        if (error.response?.data?.errors) {

            const validationErrors = Object.values(error.response.data.errors)
                .flat()
                .join(", ");

            setError(validationErrors);
        }
        else {

            setError(
                error.response?.data?.message ||
                error.response?.data?.title ||
                "Unable to submit."
            );
        }
    }

};

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-7">
            {
                error &&

                <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-lg text-sm">

                    {error}

                </div>

            }
            {/* Section Header */}
            <div className="mb-5">
                <span className="text-xs font-bold font-mono tracking-widest text-[#dc2626] uppercase">
                    //   Get in Touch
                </span>
                <h2 className="text-2xl md:text-3xl font-extrabold font-heading text-slate-800 tracking-tight mt-1">
                    Contact Us
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                    <FloatingField icon={User} label="Your Name" required value={form.name} onChange={set("name")} />
                    <FloatingField icon={AtSign} label="Your Email" type="email" required value={form.email} onChange={set("email")} />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                    <FloatingField icon={Phone} label="Phone No" type="tel" required value={form.phone} onChange={set("phone")} />
                    <FloatingField icon={Globe} label="Country" required value={form.country} onChange={set("country")} />
                </div>

                <FloatingField icon={Building2} label="City" required value={form.city} onChange={set("city")} />

                <FloatingField icon={MessageSquare} label="Your Message" required textarea value={form.message} onChange={set("message")} />

                {/*<div>*/}
                {/*    <Captcha value={captcha} onChange={setCaptcha} />*/}
                {/*</div>*/}
                <div className="flex">
                    <ReCAPTCHA
                        ref={captchaRef}
                        sitekey="6LfI8UorAAAAAEYCSGi7M3B_fNgAJlyGbNd7A1Zn"
                        onChange={(token) => setCaptchaToken(token)}
                    />
                </div>
                <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#dc2626] hover:bg-red-700 text-white font-semibold px-7 py-3 rounded-lg shadow-lg shadow-red-200 transition-all duration-300 hover:shadow-red-300 hover:-translate-y-0.5 text-sm"
                >
                    {submitted ? "Message Sent ✓" : "Send Message"}
                    {!submitted && <Send size={16} />}
                </button>
            </form>
        </div>
    );
}