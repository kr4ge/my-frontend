import { useState, useEffect } from "react";
import { FaRegPenToSquare } from "react-icons/fa6";
import { BsPeopleFill } from "react-icons/bs";
import { IoMdList } from "react-icons/io";
import { RxUpdate } from "react-icons/rx";
import HandleLoading from "../components/HandleLoading";
import apiConn from "../api";

function CustomerManager() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });
  const [customerData, setCustomerData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);

  const isEditing = editId !== null;

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await apiConn.get("api/customers/");
      setCustomerData(res.data);
    } catch (err) {
      alert("Failed to load customers.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const handleInput = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setForm({ name: "", phone: "", email: "", address: "" });
    setEditId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isEditing
      ? `api/customers/${editId}/`
      : "api/customers/";
    const method = isEditing ? apiConn.put : apiConn.post;

    try {
      await method(endpoint, form);
      alert(`Customer ${isEditing ? "updated" : "added"} successfully!`);
      fetchCustomers();
      resetForm();
    } catch (err) {
      alert(`Failed to ${isEditing ? "update" : "add"} customer.`);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (id) => {
    const selected = customerData.find((cust) => cust.id === id);
    if (selected) {
      setForm({
        name: selected.name,
        phone: selected.phone,
        email: selected.email,
        address: selected.address,
      });
      setEditId(id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex columns-2 gap-6">
      {/* Form Section */}
      <div className="md:w-[550px] h-[600px]">
        <h2 className="text-3xl font-semibold text-gray-500 p-3 flex items-center gap-3">
          {isEditing ? "Update Customer" : "Add New Customer"}
          {isEditing ? <RxUpdate /> : <BsPeopleFill className="text-4xl" />}
        </h2>
        <span className="text-sm text-gray-600 ml-3">
          Fill the form and submit.
        </span>

        <form className="mt-6 space-y-6 p-4" onSubmit={handleSubmit}>
          {[
            { label: "Customer Name", name: "name", type: "text", placeholder: "Enter customer name" },
            { label: "Customer Mobile No", name: "phone", type: "text", placeholder: "Enter customer mobile no", pattern: "\\d{10}", title: "Please enter exactly 10 digits" },
            { label: "Customer Email", name: "email", type: "email", placeholder: "Enter customer email" },
            { label: "Customer Address", name: "address", type: "text", placeholder: "Enter customer address" },
          ].map(({ label, name, ...rest }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-600">{label}</label>
              <input
                required
                name={name}
                value={form[name]}
                onChange={handleInput}
                className="mt-3 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none"
                {...rest}
              />
            </div>
          ))}

          <div className="flex gap-4">
            <button
              type="submit"
              className="font-medium mt-2 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              {isEditing ? "Update Customer" : "Add Customer"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="font-medium mt-2 px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Table Section */}
      <div className="md:w-[550px]">
        <h2 className="text-3xl font-semibold text-gray-500 p-3 flex items-center gap-3">
          View Customers
          <IoMdList />
        </h2>

        <div className="bg-slate-100 mt-3 rounded-xl mx-auto w-[540px] h-[500px]">
          <div className="bg-blue-600 w-full h-[45px] rounded-t-xl flex columns-4">
            {["Id", "Name", "Email", "Mobile"].map((col, idx) => (
              <div
                key={col}
                className={`flex-${idx === 0 ? "[0.5]" : "1"} text-white text-center pt-3 font-semibold ${
                  idx < 3 ? "border-r-2 border-white" : ""
                }`}
              >
                {col}
              </div>
            ))}
          </div>

          <div className="w-full h-[455px] rounded-b-xl overflow-x-auto">
            {customerData.map((cust) => (
              <div
                key={cust.id}
                className={`flex columns-4 h-[45px] w-full ${
                  cust.id !== 1 ? "border-t-2 border-gray-300" : ""
                }`}
              >
                <div className="flex-[0.5] text-gray-700 text-center pt-2 border-r-2 border-gray-300">
                  {cust.id}
                </div>
                <div className="flex-1 text-gray-700 indent-3 pt-2 border-r-2 border-gray-300">
                  {cust.name}
                </div>
                <div className="flex-1 text-gray-700 indent-3 pt-2 border-r-2 border-gray-300 truncate">
                  {cust.email}
                </div>
                <div className="flex-1 text-gray-700 text-center pt-2">
                  {cust.phone}
                  <button onClick={() => startEdit(cust.id)}>
                    <FaRegPenToSquare className="ml-3 text-xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {loading && <HandleLoading />}
    </div>
  );
}

export default CustomerManager;
