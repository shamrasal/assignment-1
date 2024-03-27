'use client'
 import { Card, Grid, Container ,Button} from '@mantine/core';
 import '@mantine/core/styles.css';
import { useState,useEffect} from 'react'
import { MdOutlineWifiCalling3 } from "react-icons/md";
import { ImSphere } from "react-icons/im";
import { TbUserPlus } from "react-icons/tb";
import { CiTrash } from "react-icons/ci";
import { CiStar } from "react-icons/ci";

type User = {
  name: string;
  email: string;
  phone: string;
  website: string;
  followStatus: boolean;
}


export default function HomePage() {
  const [userData, setUserData] = useState<User[]>([]);
  const colorArray: string[] = ['#8e24aa', '#e53935', '#d81b60'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Make the API call
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        // Check if the response is successful
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const jsonData: User[] = await response.json();
        const updatedData = jsonData.map((user) => ({ ...user, followStatus: false }));
        setUserData(updatedData);
      } catch (error) {
      }
    };

    // Call the fetch data function
    fetchData();
  }, []); // Empty dependency array to ensure the effect runs only once when mounted.

  //Function to write the mail
  const handleEmailClick = (email:string) => {
    window.location.href = `mailto:${email}`;
  };

  //Function to remove user from array of users
  const removeUserAtIndex = (indexToRemove: number) => {
    const updatedUserData = [...userData];
    updatedUserData.splice(indexToRemove, 1);
    setUserData(updatedUserData); 
  };

  //Function to store followed user data
  const storeFollowedUser = (indexToRemove:number) => {
    const updatedUserData = [...userData];
    const userToUpdate = updatedUserData[indexToRemove];
    const updatedUser = { ...userToUpdate, followStatus: !userToUpdate.followStatus };
    updatedUserData[indexToRemove] = updatedUser;
    setUserData(updatedUserData); 
  };

  return (
    <div className='row' style={{ padding: '12px'}}>
      <Grid>
        {
        userData.length > 0 && userData.map((user, userIndex) => {
          console.log(user)
          let userNameInitial = user.name
            .split(" ")
            .map((word, index, array) =>
              index === 0 || index === array.length - 1 ? word[0] : null
            )
            .join("");
          return(
            <Grid.Col key={userIndex} span={{ base: 12, xl:3,lg:3, md:6, xs: 6 }}>
              <Card withBorder shadow="sm" radius="md" padding='md' style={{ marginBottom: '16px',minHeight:'60vh',maxHeight:'60vh' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center',paddingTop:'20px' }}>
                  <div title={ user.name} className='mt-2' style={{ width: '120px', height: '120px', borderRadius: '50%', backgroundColor: colorArray[userIndex % colorArray.length], display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <span  style={{ color: 'white', fontSize: '60px', cursor:'pointer'}}>
                      {userNameInitial}
                    </span>
                  </div>
                  <text style={{ textAlign: 'center', marginTop: '20px',marginBottom:'10px',fontSize:'20px' }}>{user.name || ''}{" "}{user.followStatus == true && <CiStar />}</text>
                  <div style={{textAlign:'left',width:'95%'}}>
                    <div onClick={()=>handleEmailClick(user.email)} style={{marginBottom:'7px',color:'rgb(145 145 145)',cursor:'pointer'}}>@ {user.email || ''}</div>
                    <span style={{marginBottom:'7px',color:'rgb(145 145 145)',cursor:'pointer'}}> <MdOutlineWifiCalling3 style={{ marginRight: '8px' }} /> {user.phone || ''}</span>
                    <div> <ImSphere style={{ marginRight: '8px' }} /><a href={user.website} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'underline',color:'rgb(145 145 145)',cursor:'pointer' }}>{user.website}</a></div>
                    <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px',display:'flex' }}>
                      <Button onClick={()=>storeFollowedUser(userIndex)} style={{background:user.followStatus == false ? '#228be6' : 'white',color:user.followStatus == false ? 'white' : "",marginRight:'5px',cursor:'pointer'}} fullWidth gradient={{from: 'blue', to: 'blue', deg: 90} } leftSection={<TbUserPlus size={14} />} variant="default">
                        {user.followStatus == false ? 'Follow' : 'Unfollow'}
                      </Button>
                      <Button onClick={()=>removeUserAtIndex(userIndex)} style={{background:'white',cursor:'pointer'}} fullWidth gradient={{from: 'blue', to: 'blue', deg: 90} } leftSection={<CiTrash size={14} />} variant="default">
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            </Grid.Col>
          )
        })
        }
      </Grid>
    </div>
  )
}