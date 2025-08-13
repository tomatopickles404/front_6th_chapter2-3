export interface User {
  id: number
  username: string
  image: string
  firstName: string
  lastName: string
  age: number
  email: string
  phone: string
  address: {
    address: string
    state: string
    city: string
  }
  company: {
    name: string
    title: string
  }
}
