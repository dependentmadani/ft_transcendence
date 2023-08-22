// interface User {
//     id: number;
//     username: string;
//     avatar: string,
// }

export const Infos = ({ currentUser }: any) => {

  return (
    <div className="search">
        <h3>M3lomat</h3>
        <div className="userChat">
            <div className="contactInfos">
                <div className="contactAvatar">
                    <img src={ currentUser?.avatar ? currentUser.avatar : `https://assets.mycast.io/actor_images/actor-steve-minecraft-90370_large.jpg?1589410150` } alt="user_avatar" />
                </div>
                <span>gg{ currentUser?.username }</span>
            </div>
            <div className="contactPlay">
                <button>Play</button>
                <button>add friend</button>
            </div>

            <div className="mutualFriends">
                <ul>
                    <li>gg</li>
                    <li>gg</li>
                    <li>gg</li>
                </ul>
            </div>
            <div className="mutualGroups">
                <ul>
                    <li>gg</li>
                    <li>gg</li>
                    <li>gg</li>
                </ul>
            </div>
            {/* <div className="userChatInfo">
            </div>
            <div className="mutualFriends">
                <p>mutual Friends</p>
            </div>
            <div className="mutualGroups">
                <p>mutual Groups</p>
            </div> */}
        </div>
    </div>
  )
}
