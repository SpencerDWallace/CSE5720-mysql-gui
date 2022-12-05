import React, { useEffect, useState } from "react";
import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import { deleteSqlData, updateSqlData, addSqlData } from "./queries";

const RenderTextField = ({str, callback, index, childKey}) =>{

  const handleChange = event =>{
    callback(event.target.value, index);
  }

  return(
      <TextField key={childKey} value={(str==null)?'':str} onChange={handleChange}/>
  )
}

const RenderAttributes = ({attributes, parentName, deleteFromParent, updateParent, index}) =>{
  const [originalValues, setOriginalValues] = useState(Object.values(attributes));
  const [keys, setKeys] = useState(Object.keys(attributes))
  const [values, setValues] = useState(Object.values(attributes));

  const internalSetValues = (newValue, index) =>{
    const valuesCopy = JSON.parse(JSON.stringify(values));
    valuesCopy[index] = newValue;
    setValues(valuesCopy);
  }

  const handleDelete = async()=>{
    const old = [];
    for(let j = 0; j < originalValues.length; j++){
      let index = {};
      index[keys[j]] = originalValues[j];
      index['type'] = typeof(originalValues[j]);
      old.push(index);
    }
    console.log('query data is', {name:parentName, data:old});
    const result = await deleteSqlData({name:parentName, data:old});
    if(result.success === true){
      deleteFromParent(index);
    }
    else{
      window.alert(result.err.sqlMessage);
    }
    console.log(result);
  }

  const handleUpdate = async()=>{
    const newValues = [];
    for(let j = 0; j < values.length; j++){
      let index = {};
      index[keys[j]] = values[j];
      index['type'] = typeof(values[j]);
      newValues.push(index);
    }
    const old = [];
    for(let j = 0; j < originalValues.length; j++){
      let index = {};
      index[keys[j]] = originalValues[j];
      index['type'] = typeof(originalValues[j]);
      old.push(index);
    }
    console.log('query data is', {name:parentName, data:{old:old, new:newValues}});
    const data = {old:old, new:newValues}
    const result = await updateSqlData({name:parentName, data:{old:old, new:newValues}});
    if(result.success === true){
      let updateData = {};
      for(let j = 0; j < keys.length; j++){
        updateData[keys[j]] = values[j];
      }
      updateParent(updateData, index);
    }
    else{
      window.alert(result.err.sqlMessage);
    }
    console.log(result);
  }

  let i = -1;
  return(
    <>
      {
        Object.values(attributes)?.map((attribute) => {
          i++;
          return(
            <>
              <TableCell key={parentName+"-cell-"+ attribute + '-'+ i} align="left">
                <RenderTextField key={parentName+"-text-parent-" + attribute + '-'+i} str={values[i]} callback={internalSetValues} index={i} childKey={parentName+"-textfield-"+i}/>
              </TableCell>
            </>
          )
        })
      }
      <TableCell key={parentName+"-cell-options-"+i}>
        <div style={{float:'right', display:'flex', flexDirection:'column'}}>
        <Button key={parentName+"-delete-"+i} sx={{ marginRight:'2rem', color:'red'}} onClick={handleDelete} className="task-button" >Delete</Button>
        <Button key={parentName+"-update-"+i} sx={{ marginRight:'2rem'}} onClick={handleUpdate} className="task-button" >Update</Button>
        </div>
      </TableCell>
    </>
  )
}

const RenderFields = ({data, parentName}) =>{
  let fields = [];
  Object.keys(data)?.forEach((key)=>{
    fields.push(<TableCell sx={{fontWeight:'600'}} key={parentName+'-'+key} align="left">{key}</TableCell>);
  })  
  return(
  <>
    {fields}
  </>
  );
}

const RenderAddField = ({data, parentName, handleAdd}) =>{
  const [values, setValues] = useState(Array(Object.keys(data).length).fill(''));
  const [originalValues, setOriginalValues] = useState(Object.values(data));
  const [keys, setKeys] = useState(Object.keys(data))

  const internalSetValues = (newValue, index) =>{
    const valuesCopy = JSON.parse(JSON.stringify(values));
    valuesCopy[index] = newValue;
    setValues(valuesCopy);
  }

  const handleAddInternal = async() =>{
    const add = [];
    for(let j = 0; j < keys.length; j++){
      let index = {};
      index[keys[j]] = values[j];
      index['type'] = typeof(originalValues[j]);
      add.push(index);
    }
    console.log('query data is', {name:parentName, data:add});
    const result = await addSqlData({name:parentName, data:add});
    if(result.success === true){
      let addData = {};
      for(let j = 0; j < keys.length; j++){
        addData[keys[j]] = values[j];
      }
      console.log("addData", addData);
      handleAdd(addData);
      handleResetInternal();
    }
    else{
      window.alert(result.err.sqlMessage);
    }
    console.log(result);
  }

  const handleResetInternal = () =>{
    setValues(Array(Object.keys(data).length).fill(''));
  }

  let i = -1;
  return(
  <>
  {
    Object.keys(data)?.map((key)=>{
    i++;
    return(
      <>
        <TableCell key={parentName+'-'+key+'-'+'addCell-'+i} align="left">
        <RenderTextField key={parentName+'-'+key+'-'+'add-'+i} 
        str={values[i]} callback={internalSetValues} index={i} 
        childKey={parentName+'-'+key+'-'+'add-textfield-'+i}/>        
        </TableCell>
      </>
    )
    })  
  }
    <TableCell key={parentName+"-cell-options-"+i}>
          <div style={{float:'right', display:'flex', flexDirection:'column'}}>
          <Button key={parentName+"-reset-add-button"+i} sx={{ marginRight:'2rem', color:'red'}} onClick={handleResetInternal} className="task-button" >RESET</Button>
          <Button key={parentName+"-add-button"+i} sx={{ marginRight:'2rem'}} onClick={handleAddInternal} className="task-button" >ADD</Button>
          </div>
    </TableCell>
  </>
  );
}

const RenderTable = ({TableData, name, index, updateParent}) => {

  const deleteItemInternal = (indexNum) =>{
    let copy = JSON.parse(JSON.stringify(TableData));
    copy.splice(indexNum,1);
    updateParent(copy, name, index);
  }

  const updateItemInternal = (newItem, indexNum) =>{
    let copy = JSON.parse(JSON.stringify(TableData));
    copy[indexNum] = newItem;
    updateParent(copy, name, index);
  }

  const addItemInternal = (newItem) =>{
    let copy = JSON.parse(JSON.stringify(TableData));
    copy.push(newItem);
    updateParent(copy, name, index);
  }

    return(
      <>
      {
        (TableData[0] === null || TableData[0] === undefined) ? <></> :
      
      <TableContainer sx={{ marginBottom: '1rem', }} component={Paper}>
      <Table sx={{ minWidth: 650, }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{border:'none', fontSize:'2rem', fontWeight:'bold', textTransform:'capitalize'}} key={name + (Math.random() + 1).toString(36).substring(7)} align="left">{name}</TableCell>
          </TableRow>
          <TableRow>
            <RenderFields parentName={name} data={TableData[0]}/>
          </TableRow>
        </TableHead>
        <TableBody key={name}>
        {
          TableData?.map((data) => {
            return(
            <TableRow
            key={name + "-row-" + Object.values(data).toString()}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <RenderAttributes key={name + "-attributes-" + Object.values(data).toString()} index={TableData.indexOf(data)} attributes={data} parentName={name} deleteFromParent={deleteItemInternal} updateParent={updateItemInternal}/>
            </TableRow>
            )
          })
        }
          <TableRow
            key={name + "-addItem"}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
          <RenderAddField key={name + "-addfield-row"} data={TableData[0]} parentName={name} handleAdd={addItemInternal} />
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
}
    </>
    );
  }

  export{RenderTable};