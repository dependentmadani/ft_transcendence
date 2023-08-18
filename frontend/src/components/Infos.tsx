interface User {
    id: number;
    username: string;
    avatar: string,
}

export const Infos = ({ currentUser }) => {

  return (
    <div className="search">
        <h3>M3lomat</h3>
        <div className="userChat">
            <img src={ currentUser?.avatar } alt="user_avatar" />
            <div className="userChatInfo">
                <span>{ currentUser?.username }</span>
            </div>
            <button>Play</button>
            <div className="mutualFriends">
                <p>mutual Friends</p>
            </div>
            <div className="mutualGroups">
                <p>mutual Groups</p>
            </div>
        </div>
    </div>
  )
}
