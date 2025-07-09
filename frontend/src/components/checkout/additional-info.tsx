export default function AdditionalInfo() {
  return (
    <div className="bg-white p-6 md:p-8 rounded-lg shadow-md mt-8">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Additional Info</h2>
      <div>
        <label
          htmlFor="orderNotes"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Order Notes (Optional)
        </label>
        <textarea
          id="orderNotes"
          name="orderNotes"
          rows={4}
          placeholder="Notes about your order, e.g. special notes for delivery"
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
        ></textarea>
      </div>
    </div>
  );
}
