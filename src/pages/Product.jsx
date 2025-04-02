import HandleLoading from "../components/HandleLoading";
import { FaRegPenToSquare, FaChevronDown } from "react-icons/fa6";
import { AiFillProduct } from "react-icons/ai";
import { RxUpdate } from "react-icons/rx";
import { IoMdList } from "react-icons/io";
import apiConn from "../api";
import { useState, useEffect } from "react";

function ProductManager() {
  const [form, setForm] = useState({
    name: "",
    costPrice: "",
    sellingPrice: "",
    description: "",
    stockQuantity: "",
    productCategory: "",
    is_active: true,
  });

  const [productCategories, setProductCategories] = useState([]);
  const [productList, setProductList] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = editingProductId !== null;

  const fetchProducts = () => {
    setIsLoading(true);
    apiConn
      .get("api/products/all/")
      .then((res) => setProductList(res.data))
      .catch(() => alert("Failed to fetch products."))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setIsLoading(true);
    apiConn
      .get("api/categories/")
      .then((res) => setProductCategories(res.data))
      .catch(() => alert("Failed to fetch categories."))
      .finally(() => setIsLoading(false));

    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const val = name === "is_active" ? value === "true" : value;
    setForm((prev) => ({ ...prev, [name]: val }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      costPrice: "",
      sellingPrice: "",
      description: "",
      stockQuantity: "",
      productCategory: "",
      is_active: true,
    });
    setEditingProductId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const data = { ...form };

    const request = isEditing
      ? apiConn.put(`api/products/${editingProductId}/`, data)
      : apiConn.post("api/products/", data);

    request
      .then(() => {
        alert(`Product ${isEditing ? "updated" : "added"} successfully!`);
        fetchProducts();
        resetForm();
      })
      .catch(() => alert(`Failed to ${isEditing ? "update" : "add"} product.`))
      .finally(() => setIsLoading(false));
  };

  const populateForm = (id) => {
    const selected = productList.find((p) => p.id === id);
    if (selected) {
      setForm({
        name: selected.name,
        costPrice: selected.costPrice,
        sellingPrice: selected.sellingPrice,
        description: selected.description,
        stockQuantity: selected.stockQuantity,
        productCategory: selected.productCategory,
        is_active: selected.is_active,
      });
      setEditingProductId(id);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md flex columns-2 gap-6">
      {/* FORM SECTION */}
      <div className="md:w-[550px] h-[700px]">
        <h2 className="text-3xl font-semibold text-gray-500 p-3 flex items-center gap-3">
          {isEditing ? "Update Product" : "Add New Product"}
          {isEditing ? <RxUpdate /> : <AiFillProduct />}
        </h2>

        <span className="text-sm text-gray-600 ml-3">
          Fill the form and submit.
        </span>

        <form className="mt-6 space-y-6 p-4" onSubmit={handleSubmit}>
          {/* NAME */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Product Name
            </label>
            <input
              required
              type="text"
              name="name"
              placeholder="Enter product name"
              value={form.name}
              onChange={handleChange}
              className="mt-3 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          {/* COST & SELLING */}
          <div className="flex gap-4">
            {[
              { label: "Cost Price", name: "costPrice" },
              { label: "Selling Price", name: "sellingPrice" },
            ].map(({ label, name }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-gray-600">
                  {label}
                </label>
                <input
                  required
                  type="text"
                  name={name}
                  placeholder={`Enter ${label.toLowerCase()}`}
                  pattern="[0-9]+(\.[0-9][0-9]?)?"
                  title="Enter a valid number"
                  value={form[name]}
                  onChange={handleChange}
                  className="mt-3 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                />
              </div>
            ))}
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Description
            </label>
            <textarea
              required
              rows="2"
              name="description"
              placeholder="Enter product description"
              value={form.description}
              onChange={handleChange}
              className="resize-none mt-3 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            ></textarea>
          </div>

          {/* STOCK */}
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Stock Quantity
            </label>
            <input
              required
              name="stockQuantity"
              type="text"
              pattern="[0-9]+"
              placeholder="Enter stock quantity"
              value={form.stockQuantity}
              onChange={handleChange}
              className="mt-3 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>

          {/* CATEGORY + STATUS */}
          <div className={`${isEditing ? "flex gap-4" : ""}`}>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-600">
                Product Category
              </label>
              <div className="relative">
                <select
                  required
                  name="productCategory"
                  value={form.productCategory}
                  onChange={handleChange}
                  className="mt-3 block w-full px-3 py-2 border border-gray-300 rounded-md bg-white shadow-sm appearance-none pr-8"
                >
                  <option value="">Select a category</option>
                  {productCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                  <FaChevronDown />
                </div>
              </div>
            </div>

            {/* STATUS (Edit Mode Only) */}
            {isEditing && (
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-600">
                  Status
                </label>
                <div className="mt-2">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="is_active"
                      value="true"
                      checked={form.is_active === true}
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span className="ml-2">Active</span>
                  </label>
                  <label className="inline-flex items-center ml-6">
                    <input
                      type="radio"
                      name="is_active"
                      value="false"
                      checked={form.is_active === false}
                      onChange={handleChange}
                      className="form-radio"
                    />
                    <span className="ml-2">Discontinued</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4">
            <button
              type="submit"
              className="font-medium mt-2 px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600"
            >
              {isEditing ? "Update Product" : "Add Product"}
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

      {/* PRODUCT TABLE */}
      <div className="md:w-[550px]">
        <h2 className="text-3xl font-semibold text-gray-500 p-3 flex items-center gap-3">
          View Products
          <IoMdList />
        </h2>
        <div className="bg-slate-100 mt-3 rounded-xl w-[540px] h-[600px]">
          <div className="bg-blue-600 h-[45px] rounded-t-xl flex columns-4">
            {["Id", "Name", "Pricing C/S", "Stock"].map((col, idx) => (
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

          <div className="h-[555px] overflow-x-auto rounded-b-xl">
            {productList.map((p) => (
              <div
                key={p.id}
                className="flex columns-4 h-[45px] w-full border-t-2 border-gray-300"
              >
                <div className="flex-[0.5] text-gray-700 text-center pt-2 border-r-2 border-gray-300">
                  {p.id}
                </div>
                <div className="flex-1 text-gray-700 indent-3 pt-2 border-r-2 border-gray-300">
                  {p.name}
                </div>
                <div className="flex-1 text-gray-700 indent-3 pt-2 border-r-2 border-gray-300 truncate">
                  {p.costPrice}/{p.sellingPrice}
                </div>
                <div className="flex-1 text-gray-700 text-center pt-2">
                  {p.stockQuantity}
                  <button onClick={() => populateForm(p.id)}>
                    <FaRegPenToSquare className="ml-3 text-xl" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {isLoading && <HandleLoading />}
    </div>
  );
}

export default ProductManager;
