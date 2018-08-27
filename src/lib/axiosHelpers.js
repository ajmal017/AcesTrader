// axiosHelpers.js

import axios from 'axios'

export const getRepos = (username) => {
// function getRepos(username) {
  return axios.get('https://api.github.com/users/' + username + '/repos')
}

export const getUserInfo = (username) => {
    // function getUserInfo(username) {
  return axios.get('https://api.github.com/users/' + username)
}

export const getGithubInfo = (username) => {
//   getGithubInfo: function(username) {
    return axios.all([getRepos(username), getUserInfo(username)]).then(function(arr) {
      return {
        repos: arr[0].data,
        bio: arr[1].data,
      }
    })
  },
}

