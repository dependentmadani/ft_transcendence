
import { Link } from 'react-router-dom';
import InviteClassic from './InviteClassic';

type MyComponentProps = {
    Mode:string;
    ProfileId1:number;
    ProfileId2:number;
  };
  const Invite: React.FC<MyComponentProps> = ({Mode}) =>
  {
  
    const playerID1 = ;
    const playerID2 =  ;

  return (

    // <div className="GameHome">
    <>
        { Mode === 'InviteClassic' &&  <InviteClassic ProfileID1={} ProfileID2={}/> }
        { Mode === 'InviteMatch' && <InviteClassic ProfileID1={} ProfileID2={}/>}
    </>
    {/* // </div> */}
  );3
}