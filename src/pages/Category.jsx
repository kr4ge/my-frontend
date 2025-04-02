import { useState, useEffect } from "react";
import { TbCategoryFilled } from "react-icons/tb";
import { FaRegPenToSquare, FaPlus } from "react-icons/fa6";
import { IoMdList } from "react-icons/io";
import { RxUpdate } from "react-icons/rx";
import apiConn from "../api";
import HandleLoading from "../components/HandleLoading";

function CategoryManager() {
  const [categoryName, setCategoryName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const isEditing = editingId !== null;

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await apiConn.get("api/categories/");
      setCategoryList(res.data);
    } catch (err) {
      alert("Unable to load categories.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const payload = { name: categoryName };

    const request = isEditing
      ? apiConn.put(`api/categories/${editingId}/`, payload)
      : apiConn.post("api/categories/", payload);

    request
      .then(() => {
        alert(`Category ${isEditing ? "updated" : "created"} successfully!`);
        fetchCategories();
        resetForm();
      })
      .catch(() => alert(`Failed to ${isEditing ? "update" : "add"} category.`))
      .finally(() => setIsLoading(false));
  };

  const startEdit = (id) => {
    const match = categoryList.find((cat) => cat.id === id);
    if (match) {
      setCategoryName(match.name);
      setEditingId(id);
    }
  };

  const resetForm = () => {
    setCategoryName("");
    setEditingId(null);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md w-[700px]">
      <h2 className="text-3xl font-semibold text-gray-500 p-3 flex items-center gap-3">
        {isEditing ? "Update Category" : "New Category"}
        {isEditing ? <RxUpdate /> : <TbCategoryFilled />}
      </h2>

      <form className="flex col-span-2 justify-between" onSubmit={handleSubmit}>
        <input
          required
          type="text"
          placeholder="Enter category name"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          className="mt-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none w-[300px]"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className="font-medium mt-3 px-4 text-white bg-blue-500 rounded-lg hover:bg-blue-600 flex items-center gap-1"
          >
            {isEditing ? "Update Category" : "Add Category"}
            {!isEditing && <FaPlus />}
          </button>
          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="font-medium mt-3 px-4 text-white bg-red-500 rounded-lg hover:bg-red-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <h2 className="text-3xl font-semibold text-gray-500 p-3 flex items-center gap-3 mt-7 mb-7">
        View Categories
        <IoMdList />
      </h2>

      <div className="bg-slate-100 mt-3 rounded-xl mx-auto w-[600px] h-[500px]">
        <div className="bg-blue-600 w-full h-[45px] rounded-t-xl flex columns-4">
          <div className="flex-1 text-white text-center pt-3 border-r-2 border-white font-semibold">
            Id
          </div>
          <div className="flex-1 text-white text-center pt-3 border-r-2 border-white font-semibold">
            Name
          </div>
          <div className="flex-1 text-white text-center pt-3 font-semibold">
            Products
          </div>
        </div>

        <div className="w-full h-[455px] overflow-y-auto rounded-b-xl">
          {categoryList.map((cat) => (
            <div
              key={cat.id}
              className="flex columns-4 h-[45px] border-b-2 border-gray-300"
            >
              <div className="text-gray-700 text-center flex-1 pt-2 pl-2 border-r-2 border-gray-300">
                {cat.id}
              </div>
              <div className="text-gray-700 text-center flex-1 pt-2 pl-2 border-r-2 border-gray-300">
                {cat.name}
              </div>
              <div className="text-gray-700 flex-1 pt-1 pl-2 flex items-center justify-center">
                {cat.product_count}
                <button onClick={() => startEdit(cat.id)}>
                  <FaRegPenToSquare  className="ml-3 text-xl" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isLoading && <HandleLoading />}
    </div>
  );
}

export default CategoryManager;
