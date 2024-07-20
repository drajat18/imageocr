import React,{useState} from "react";
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
import { Menu } from 'antd';
import { useNavigate } from "react-router-dom";




const Home = () =>{
    const [current, setCurrent] = useState('mail');

  const onClick = (e) => {
    console.log('click ', e);
    setCurrent(e.key);
  };

    return(
        <div>
           <div> THis is Home  </div>
           <div></div>

        </div>
    )
}
export default Home;