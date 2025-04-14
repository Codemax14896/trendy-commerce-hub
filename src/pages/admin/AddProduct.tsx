
import ProductForm from "@/components/ProductForm";

const AddProduct = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-tnTrendy-purple-dark mb-8">Add New Product</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ProductForm />
      </div>
    </div>
  );
};

export default AddProduct;
