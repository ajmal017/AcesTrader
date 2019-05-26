// appUseSandboxStatus.js

let currentUseSandboxStatus = false

export const setSandboxStatus = (currentStatus) => {
    currentUseSandboxStatus = currentStatus
}
export const getSandboxStatus = () => currentUseSandboxStatus
