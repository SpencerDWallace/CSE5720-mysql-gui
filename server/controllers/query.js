const e = require("express");
const connection = require("../connect")

const generateSet = (data) =>{
    let set = " SET "
    data.forEach((index)=>{
        const key = Object.keys(index);
        console.log(key);
        if(index[key[1]] === 'string')
        set += key[0] + '=' + '"'+index[key[0]]+'"' + ", ";
        else
        set += key[0] + '=' + index[key[0]] + ", ";
    })
    return set.slice(0, set.length-2);
}

const generateWhere = (data) =>{
    let where = " WHERE "
    data.forEach((index)=>{
        const key = Object.keys(index);
        console.log(key);
        if(index[key[0]] != null){
        if(index[key[1]] === 'string')
            where += key[0] + '=' + '"'+index[key[0]]+'"' + ' and ';
        else
            where += key[0] + '=' + index[key[0]] + ' and ';
        }
    })
    return where.slice(0, where.length-5);
}

const generateInsertKeys = (data) =>{
    let insert = " ("
    data.forEach((index)=>{
        const key = Object.keys(index);
        insert += key[0] + ", "
        }
    )
    
    insert = insert.slice(0, insert.length-2)+")";
    return insert;
}

const generateValues = (data) =>{
    let valueString = " ("
    data.forEach((index)=>{
        const key = Object.keys(index);
        console.log(key);
        if(index[key[0]] != null){
            if(index[key[1]] === 'string')
                valueString += '"'+index[key[0]]+'", ';
            else
                valueString += index[key[0]] + ', ';
        }
    })
    valueString = valueString.slice(0, valueString.length-2)+")";
    return valueString;
}

const queryDB = ((req, res, next) =>{
    let fields = ['authors', 'customers', 'publishers', 'subjects', 'titleauthors', 'titles'];
    // let fields = ['advertiser', 'blurt', 'blurt_analysis', 'celebrity', 'follow', 'hobby', 'topic', 'user', 'user_ad', 'vendor', 'vendor_ambassador', 'vendor_topics'];
    let dbJSON = {};
    fields.forEach(field=>{
        dbJSON[field] = [];
    })
    var resSent = false;
    fields.forEach((field, i)=>{
        connection.query(`SELECT* FROM ${field} LIMIT 10`,
        function (err, result, f) {
            if (err) { console.log(err); return; }
            // console.log(dbJSON);
            result.forEach(res=>{
                Object.keys(res).forEach(key=>{
                    if(res[key] instanceof Date){
                        console.log(res[key])
                        res[key] = res[key].toISOString().split('T')[0]
                    }
                })
            })
            dbJSON[field] = result;
            if(!resSent && i == fields.length - 1){
                console.log(dbJSON);
                res.json(dbJSON);
                resSent = true;
                return;
            }
        });
    })
})

const deleteItem = ((req, res, next) => {
    const {deleteData} = req.body;
    if(!deleteData.tableName){
        res.status(400).send("Invalid Query");
        return;
    }
    let deletePortion = "DELETE FROM " + deleteData.tableName;
    let wherePortion = generateWhere(deleteData.data);
    console.log(deletePortion, wherePortion);
    connection.query(deletePortion + wherePortion,
    function (err, result, f) {
        if (err) { res.json({success:false, err}); return; }
        console.log(result);
        if(result.OkPacket?.affectedRows === 0)
            res.json({success:false, err:{sqlMessage:'No Rows Affected.'}});
        else
            res.json({success:true});        return;
    });

})

const updateItem = ((req, res, next) => {
    const {updateData} = req.body;
    if(!updateData.tableName){
        res.status(400).send("Invalid Query");
        return;
    }
    let updatePortion = "UPDATE " + updateData.tableName;
    let setPortion = generateSet(updateData.data.new);
    let wherePortion = generateWhere(updateData.data.old);
    console.log(updatePortion, setPortion, wherePortion);
    connection.query(updatePortion + setPortion + wherePortion,
        function (err, result, f) {
            if (err) { res.json({success:false, err}); return; }
            console.log("result is", result.affectedRows);
            if(result.affectedRows === 0)
                res.json({success:false, err:{sqlMessage:'No Rows Affected.'}});
            else
                res.json({success:true});            return;
        });

            // console.log(dbJSON);
})

const addItem = ((req, res, next) => {
    const {addData} = req.body;
    console.log(addData)
    if(!addData.tableName){
        res.status(400).send("Invalid Query");
        return;
    }
    let addPortion = "INSERT IGNORE INTO " + addData.tableName + generateInsertKeys(addData.data);
    let valuesPortion = " VALUES " + generateValues(addData.data);

    console.log(addPortion, valuesPortion);
    connection.query(addPortion + valuesPortion,
        function (err, result, f) {
            if (err) { res.json({success:false, err}); return; }
            console.log(result);
            if(result.affectedRows === 0)
                res.json({success:false, err:{sqlMessage:'No Rows Affected.'}});
            else
                res.json({success:true});
            return;
        });

            // console.log(dbJSON);
})

module.exports = {
    queryDB, deleteItem, updateItem, addItem
}