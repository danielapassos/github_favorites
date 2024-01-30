export class GitHubUser {
    static search(username){
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint)
            .then(data => data.json())
            .then(({ login, name, public_repos, followers }) => ({
                login,
                name,
                public_repos,
                followers
            }))
    }
}

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root)
        this.load()

        GitHubUser.search('danielapassos')
            .then(user => { console.log(user)})
    }

    delete(user){
        const filteredEntries = this.entries
        .filter(entry => {
            return true
        })
        this.entries = filteredEntries
        this.update()
        this.save()
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
        
    }

    save(){
        localStorage.setItem('@github-favorites', JSON.stringify(this.entries))
    }

    async add(username){
        try{

        const userExists = this.entries.find( entry  => entry.login === username)

        if(userExists){
            throw new Error('User is already in your list.')
        }

        const user = await GitHubUser.search(username)

        if (user.login === undefined){
            throw new Errror ('User not found.')
        }

        this.entries = [user, ...this.entries]
        this.update()
        this.save()
        
        } catch (error){
            alert(error.message)
        }
    }
}

export class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector('table tbody')
        this.update()
    }

    onadd(){
        const addButton = this.root.querySelector('.search button')
        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input')

            this.add(value)
        }
    }

    update() {
        this.removeAllTr()

        
        entries.forEach( user => {
            const row = this.createRow()
            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user a').href = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.user repositories').textContent = user.public_repos
            row.querySelector('.user followers').textContent = user.followers

            row.querySelector('.remove').onclick= () => {
                const isOK = confirm('Are you sure about deleting this?')
                if (isOK) {
                    this.delete(user)
                }
            }

            this.tbody.append(row)


        })
    }

    createRow(){
        const tr = document.createElement('tr')

        tr.innerHTML= `
            <td class="user">
                <img src="https://github.com/danielapassos.png" alt="Profile picture">
                <a href="https://github.com/danielapassos" target="_blank">
                    <p>Dani Passos</p>
                    <span>danielapassos</span>
                </a>
            </td>
            <td class="repositories">
                40
            </td>
            <td class="followers">
                23
            </td>
            <td>
                <button class="remove">&times;</button>
            </td>
        `
        
        return tr
    }

    removeAllTr() {

        tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove()
        });
    }
}