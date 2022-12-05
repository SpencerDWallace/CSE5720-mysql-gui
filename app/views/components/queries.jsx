import axios from "axios";


const getSqlData = async () => {
    try {
      const { data } = await axios.get(`/api/db`);
      //console.log(data);
      return data;
  } catch (error) {
      console.error(error);
      return {err:error.response?.data, success:false};
  }
  }

  const deleteSqlData = async (dataToDelete) => {
    try {
        const { data } = await axios.post(`/api/db/delete`, {
            deleteData:{
                tableName:dataToDelete.name,
                data:dataToDelete.data
            }
        });
        return data;

    } catch (error) {
        console.error(error);
        return {err:error.response?.data, success:false};
    }
  }

  const updateSqlData = async (dataToUpdate) => {
    try {
        const { data } = await axios.post(`/api/db/update`, {
            updateData:{
                tableName:dataToUpdate.name,
                data:{
                    old:dataToUpdate.data.old,
                    new:dataToUpdate.data.new,
                }
            }
        });
        return data;

    } catch (error) {
        console.error(error);
        return {err:error.response?.data, success:false};
    }
  }

  const addSqlData = async (dataToAdd) => {
    try {
        const { data } = await axios.post(`/api/db/add`, {
            addData:{
                tableName:dataToAdd.name,
                data:dataToAdd.data
            }
        });
        return data;

    } catch (error) {
        console.error(error);
        return {err:error.response?.data, success:false};
    }
  }

  export{getSqlData, deleteSqlData, updateSqlData, addSqlData};