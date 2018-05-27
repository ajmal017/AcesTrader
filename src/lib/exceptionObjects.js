export function UserException(message) {
   this.message = message;
   this.name = "UserException";
}

export function AppException(message) {
   this.message = message;
   this.name = "AppException";
}
