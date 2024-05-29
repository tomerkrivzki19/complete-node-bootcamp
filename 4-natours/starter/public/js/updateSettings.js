//create an update data function here , call that function in index.js (export and import inside index.js fille )
//
import axios from 'axios';
import { showAlert } from './alerts';

//update both data and the password
//type is either 'password' or 'data' , data => an object with al the data to update
export const updateSettings = async (data, type) => {
  try {
    const url =
      type === 'password'
        ? 'http://127.0.0.1:8000/api/v1/users/updateMyPassword'
        : 'http://127.0.0.1:8000/api/v1/users/updateMe';

    const res = await axios.patch(url, {
      data,
    });

    if (res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
    return;
  } catch (error) {
    showAlert('error', error.response.data.message);
    return;
  }
};
