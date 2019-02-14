import React, { Component } from "react";
import "./App.css";
import queryString from 'query-string'
const defaultColor = "#fff";

const defaultStyle = {
    color: defaultColor
};

class PlaylistCounter extends Component {
    render() {
        const divStyle = {
            width: "30%",
            display: "inline-block"
        };
        return (
            <div style={divStyle}>
                <h2 style={defaultStyle}>Number of playlists: {this.props.playlists.length}</h2>
            </div>
        );
    }
}
class FollowersCounter extends Component {
    render() {
        const divStyle = {
            width: "30%",
            display: "inline-block"
        };
        return (
            <div style={divStyle}>
                <h2 style={defaultStyle}>Followers: {this.props.followers}</h2>
            </div>
        );
    }
}
class HoursCounter extends Component {
    render() {
        let allSongs = this.props.playlists.reduce((songs, playlist) => {
            return songs.concat(playlist.songs)
        },[])
        let totalDuration = allSongs.reduce((sum, song) => {
            return sum + song.duration
        }, 0)
        const divStyle = {
            width: "30%",
            display: "inline-block"
        };
        return (
            <div style={divStyle}>
                <h2 style={defaultStyle}>Total hours: {Math.floor(totalDuration / 3600) }: {Math.floor((totalDuration % 3600) / 60)} : {Math.floor((totalDuration % 3600) % 60)} </h2>
            </div>
        );
    }
}

class SearchFilter extends Component {
    render() {
        return (
            <div style={defaultStyle}>

                <input type="text" onKeyUp={
                    event => this.props.onTextChange(event.target.value)
                }/>
            </div>
        );
    }
}
class Playlist extends Component {
    render() {
        // eslint-disable-next-line
        const playlistStyle = {
            ...defaultStyle,
            width: "25%",
            display: "inline-block"
        };

        return (
            <div style={playlistStyle}>
                <h3>{this.props.playlist.name}</h3>
                <ul>
                    {this.props.playlist.songs.map(song =>
                        <li>{song.name} - duration:{song.duration}</li>
                    )}
                </ul>
            </div>
        );
    }
}






// eslint-disable-next-line
const fakeServerData = {
    user: {
        name: 'Emilio',
        followers: 100,
        playlists: [
            {
                name: 'Playlist 1',
                songs: [
                    {
                        name: 'a1',
                        duration: 111
                    },
                    {
                        name: 'a2',
                        duration: 141
                    },
                    {
                        name: 'a3',
                        duration: 132
                    },
                    {
                        name: 'a4',
                        duration: 124
                    }
                ]
            },
            {
                name: 'Playlist 2',
                songs: [
                    {
                        name: 'b1',
                        duration: 111
                    },
                    {
                        name: 'b2',
                        duration: 121
                    },
                    {
                        name: 'b3',
                        duration: 132
                    },
                    {
                        name: 'b4',
                        duration: 124
                    }
                ]
            },
            {
                name: 'Playlist 3',
                songs: [
                    {
                        name: 'c1',
                        duration: 111
                    },
                    {
                        name: 'c2',
                        duration: 121
                    },
                    {
                        name: 'c3',
                        duration: 132
                    },
                    {
                        name: 'c4',
                        duration: 124
                    }
                ]
            },
            {
                name: 'Playlist 4',
                songs: [
                    {
                        name: 'd1',
                        duration: 111
                    },
                    {
                        name: 'd2',
                        duration: 121
                    },
                    {
                        name: 'd3',
                        duration: 132
                    },
                    {
                        name: 'd4',
                        duration: 124
                    }
                ]
            }
        ]
    }
}





class App extends Component {
    constructor() {
        super();
        this.state = {
            serverData: {},
            filterString: '',
            currentUser: null,
            playlists: null
        }
    }
    componentDidMount() {
        const parsed = queryString.parse(window.location.search)
        const accessToken = parsed.access_token

        var baseUrl = 'https://api.spotify.com'
        var endpoint_CurrentUser = '/v1/me'
        var endpoint_Playlists = '/playlists'
        var getCurrentUser = baseUrl.concat(endpoint_CurrentUser)
        var getPlaylists = getCurrentUser.concat(endpoint_Playlists)
        const header = {
            headers: {
                'Authorization': 'Bearer ' + accessToken
            }
        }

        fetch(getCurrentUser, header)
        .then(response => response.json())
        .then(data => {
            this.setState({currentUser : data})
        })

        fetch(getPlaylists, header)
        .then(response => response.json())
        .then(data => {
            this.setState({
                playlists : data.items.map(item => ({name: item.name, songs: []}))
            })
        })
    }
    render() {
        const titleStyle = {
            ...defaultStyle,
            "fontSize": "54px"
        }
        var playlistToRender = this.state.currentUser && this.state.playlists ? this.state.playlists.filter( playlist => {
            return playlist.name.toLowerCase().includes(this.state.filterString.toLowerCase())
        }) : []
        return (
            <div className="App">
                {this.state.currentUser ?
                <div>
                    <h1 style={titleStyle}>{ this.state.currentUser.display_name}'s Playlists</h1>
                    <div>
                        <PlaylistCounter playlists={playlistToRender}/>
                        <HoursCounter playlists={playlistToRender}/>
                        <FollowersCounter followers={this.state.currentUser.followers.total}/>
                        <SearchFilter onTextChange={text =>
                            this.setState({filterString: text})
                        }/>
                        {
                            playlistToRender.map( playlist =>
                                <Playlist playlist={playlist}/>
                            )
                        }
                    </div>
                </div> : <button onClick={
                    () => window.location = 'http://localhost:8888/login'
                }>Login with Spotify</button>
                }
            </div>
        );
    }
}

export default App;
