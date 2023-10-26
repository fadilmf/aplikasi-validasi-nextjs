export default function EditUserModal() {
  return (
    <>
      {/* <div className="fixed inset-0 flex items-center justify-center z-50">
        <div className="modal">
          <div className="p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Edit User</h2>
            <form>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                id="username"
                value={"selectedUser.username"}
                onChange={(e) => {
                  const updatedUser = {
                    ...selectedUser,
                    username: e.target.value,
                  };
                  setSelectedUser(updatedUser);
                }}
              />
              <button
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      </div> */}
    </>
  );
}
