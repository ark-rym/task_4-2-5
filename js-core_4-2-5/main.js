class View {
  constructor() {
    this.app = document.getElementById('app')

    this.appWrapper = this.createElement('div', 'app-wrapper')
    this.searchInput = this.createElement('input', 'search-line__input')
    this.appWrapper.append(this.searchInput)

    this.findUsersWrapper = this.createElement('div', 'users-wrapper_find')
    this.savedUsersWrapper = this.createElement('div', 'users-wrapper_saved')

    this.appWrapper.append(this.findUsersWrapper)
    this.appWrapper.append(this.savedUsersWrapper)

    this.app.append(this.appWrapper)
  }

  createElement(elementTag, elementClass, elementTextContent) {
    const element = document.createElement(elementTag)
    if (elementClass) {
      element.classList.add(elementClass)
    }
    if (elementTextContent) {
      element.textContent = elementTextContent
    }
    return element
  }

  createUsers(userData) {
    const userElement = this.createElement('button', 'repository')
    userElement.innerHTML = `${userData.name}`
    this.findUsersWrapper.append(userElement)
    return userElement
  }

  addUsers(userData) {
    const userCard = this.createElement('div', 'users-card')
    userCard.innerHTML = `<div class="users-card__inner">
                            <span class="users-card__item">Name: ${userData.name}</span>
                            <span class="users-card__item">Owner: ${userData.owner.login}</span>
                            <span class="users-card__item">Starts: ${userData.stargazers_count}</span>
                          </div>`
    const deleteCard = this.createElement('button', 'users-card__delete', 'x')
    userCard.append(deleteCard)
    this.savedUsersWrapper.append(userCard)

    console.log('my name is: ', userData.name);
    return deleteCard
  }
}

class Search {
  constructor (view) {
    this.view = view

    this.view.searchInput.addEventListener('keyup', this.debounce(this.searchUsers.bind(this), 500))
  }

  searchUsers () {
    if (this.view.searchInput.value) {
      this.loadUsers(this.view.searchInput.value)
    } else {
      this.clearUsers()
    }
  }

  loadUsers(searchValue) {
    fetch(`https://api.github.com/search/repositories?q=${searchValue}&per_page=5`)
      .then(res => res.json())
      .then(res => {
        console.log(res)
        res.items.forEach(user => {
          console.log(user.name);
          const userElement = this.view.createUsers(user)
          userElement.onclick = () => {
            const userCard = this.view.addUsers(user)
            this.clearUsers()
            this.view.searchInput.value = ''
            userCard.onclick = () => this.deleteCard(userCard)
          }
        })
      })
    this.clearUsers()
  }

  clearUsers () {
    this.view.findUsersWrapper.innerHTML = ''
  }

  deleteCard (userCard) {
    userCard.parentNode.remove()
    userCard.onclick = null
  }

  debounce = (fn, debounceTime) => {
    let timer
    function wrapper(...args) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        fn.apply(this, args)
      }, debounceTime)
    }
    return wrapper
  }
}

new Search(new View)