"use client";

import { useState } from "react";
import { Plus, Trash2, CheckCircle } from "lucide-react";

interface ProductRow {
  id: string;
  product_name: string;
  pack_size: string;
  quantity: string;
  notes: string;
}

export default function SubmitQuotePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    full_name: "",
    company: "",
    email: "",
    phone: "",
    license_number: "",
    address: "",
    city: "",
    state: "",
    zip: "",
  });

  const [products, setProducts] = useState<ProductRow[]>([
    { id: "1", product_name: "", pack_size: "", quantity: "", notes: "" },
  ]);

  function updateForm(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function addProduct() {
    setProducts((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        product_name: "",
        pack_size: "",
        quantity: "",
        notes: "",
      },
    ]);
  }

  function removeProduct(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  }

  function updateProduct(id: string, field: keyof ProductRow, value: string) {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const payload = {
      api_key: process.env.NEXT_PUBLIC_QUOTES_API_KEY || "",
      customer: form,
      cart_items: products.map((p) => ({
        product_name: p.product_name,
        pack_size: p.pack_size,
        quantity: parseFloat(p.quantity) || 1,
        notes: p.notes,
      })),
      source: "portal",
    };

    const res = await fetch("/api/quotes/external", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setSubmitted(true);
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong. Please try again.");
    }
    setLoading(false);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Quote Submitted!
          </h2>
          <p className="text-gray-500 mb-6">
            Thank you! Your quote request has been received. A member of our
            team will be in touch shortly.
          </p>
          <button
            onClick={() => {
              setSubmitted(false);
              setForm({
                full_name: "",
                company: "",
                email: "",
                phone: "",
                license_number: "",
                address: "",
                city: "",
                state: "",
                zip: "",
              });
              setProducts([
                {
                  id: "1",
                  product_name: "",
                  pack_size: "",
                  quantity: "",
                  notes: "",
                },
              ]);
            }}
            className="text-blue-600 hover:underline text-sm"
          >
            Submit another quote
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-[#1e3a5f] rounded-2xl mb-4">
            <span className="text-white font-bold text-xl">R</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Request a Quote</h1>
          <p className="text-gray-500 mt-1">
            Reichman Sales — Agricultural Chemicals
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">
              Your Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name *" required>
                <input
                  type="text"
                  required
                  value={form.full_name}
                  onChange={(e) => updateForm("full_name", e.target.value)}
                  className={inputClass}
                  placeholder="John Doe"
                />
              </Field>
              <Field label="Company / Farm Name">
                <input
                  type="text"
                  value={form.company}
                  onChange={(e) => updateForm("company", e.target.value)}
                  className={inputClass}
                  placeholder="Doe Farms"
                />
              </Field>
              <Field label="Email *" required>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                  className={inputClass}
                  placeholder="john@doefarms.com"
                />
              </Field>
              <Field label="Phone">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateForm("phone", e.target.value)}
                  className={inputClass}
                  placeholder="555-123-4567"
                />
              </Field>
              <Field label="License # (Pesticide)">
                <input
                  type="text"
                  value={form.license_number}
                  onChange={(e) => updateForm("license_number", e.target.value)}
                  className={inputClass}
                  placeholder="IL-12345"
                />
              </Field>
              <Field label="State">
                <input
                  type="text"
                  value={form.state}
                  onChange={(e) => updateForm("state", e.target.value)}
                  className={inputClass}
                  placeholder="IL"
                  maxLength={2}
                />
              </Field>
              <Field label="City" className="sm:col-span-2">
                <input
                  type="text"
                  value={form.city}
                  onChange={(e) => updateForm("city", e.target.value)}
                  className={inputClass}
                  placeholder="Springfield"
                />
              </Field>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="font-semibold text-gray-900 mb-4">
              Products Requested
            </h2>
            <div className="space-y-4">
              {products.map((product, i) => (
                <div
                  key={product.id}
                  className="border border-gray-100 rounded-lg p-4 bg-gray-50 relative"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-semibold text-gray-400 uppercase">
                      Product {i + 1}
                    </span>
                    {products.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeProduct(product.id)}
                        className="text-gray-300 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Product Name *" required>
                      <input
                        type="text"
                        required
                        value={product.product_name}
                        onChange={(e) =>
                          updateProduct(
                            product.id,
                            "product_name",
                            e.target.value,
                          )
                        }
                        className={inputClass}
                        placeholder="e.g. Roundup PowerMax"
                      />
                    </Field>
                    <Field label="Pack Size">
                      <input
                        type="text"
                        value={product.pack_size}
                        onChange={(e) =>
                          updateProduct(product.id, "pack_size", e.target.value)
                        }
                        className={inputClass}
                        placeholder="e.g. 2.5 gallon, mini bulk"
                      />
                    </Field>
                    <Field label="Quantity">
                      <input
                        type="number"
                        step="0.01"
                        value={product.quantity}
                        onChange={(e) =>
                          updateProduct(product.id, "quantity", e.target.value)
                        }
                        className={inputClass}
                        placeholder="e.g. 4"
                      />
                    </Field>
                    <Field label="Notes">
                      <input
                        type="text"
                        value={product.notes}
                        onChange={(e) =>
                          updateProduct(product.id, "notes", e.target.value)
                        }
                        className={inputClass}
                        placeholder="Any special requirements..."
                      />
                    </Field>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addProduct}
              className="mt-4 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <Plus size={14} />
              Add another product
            </button>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1e3a5f] text-white py-4 rounded-xl font-semibold text-base hover:bg-[#2d5487] transition-colors disabled:opacity-50"
          >
            {loading ? "Submitting..." : "Submit Quote Request"}
          </button>
        </form>
      </div>
    </div>
  );
}

const inputClass =
  "w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white";

function Field({
  label,
  children,
  required,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
