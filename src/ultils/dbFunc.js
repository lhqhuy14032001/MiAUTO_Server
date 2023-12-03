const dbFunc = {
  handleSelectWithoutConditon: async (db, sql) => {
    let response = {};
    let data = await db.query(sql);
    if (data.length > 0) {
      response.error = false;
      response.data = data;
    } else {
      response.error = true;
      response.data = [];
    }
    return response;
  },
};
module.exports = dbFunc;
