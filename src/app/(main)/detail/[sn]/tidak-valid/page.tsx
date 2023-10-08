"use client";

export default function TidakValidPage() {
  const handleCancel = () => {
    window.history.back();
  };

  return (
    <>
      <div className="container mx-auto p-4 mb-20">
        <h1 className="text-center">Perangkat Tidak Valid</h1>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Notes:
            <textarea
              className="mt-1 p-2 border rounded w-full"
              name=""
              id=""
              rows={4}
            />
          </label>
        </div>
        <div className="flex flex-col gap-2 md:flex-row">
          <button className="bg-green-800 hover:bg-green-900 text-white py-2 px-4 rounded-full w-full md:w-auto">
            Submit
          </button>
          <button
            className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-full w-full md:w-auto"
            onClick={handleCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
}
