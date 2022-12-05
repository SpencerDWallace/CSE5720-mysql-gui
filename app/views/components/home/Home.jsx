import React, { useState, useEffect } from "react";
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { RenderTable } from "../dbRender";
import { getSqlData } from "../queries";

const Home = ({}) => {
  const [sqlData, setSqlData] = useState({});

  const initData = async () =>{
    const data = await getSqlData();
    setSqlData(data);
  }

  useEffect(()=>{
    initData();
  }, [])

  const updateSqlData = (newData, name, index) => {
    let copy = JSON.parse(JSON.stringify(sqlData));
    console.log(copy);
    copy[name] = newData;
    console.log(copy);
    setSqlData(copy);
  }

  return (
    <Container component="main" maxWidth="lg">
      {
        Object.keys(sqlData)?.map((key, index)=>{
          return(
          <RenderTable key={key.toString() + "-" + index.toString()} TableData={sqlData[key]} name={key} index={index} updateParent={updateSqlData}/>
          )
        })
      }
    </Container>
    );
  }


export default Home;
