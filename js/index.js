document.addEventListener('DOMContentLoaded', () => {

    //grab elements to manipulate
    const gitForm = document.getElementById('github-form')
    const userList = document.getElementById('user-list')
    const repoList = document.getElementById('repos-list')

    //submit eventlistener on gitForm
    gitForm.addEventListener('submit', (e) => {
        e.preventDefault()
        let usersearch = e.target.search.value
        SearchUs(usersearch)
        gitForm.reset()
    })

    //Search function
    const SearchUs = (user) => {
        //empty DOM then append to DOM
        while (userList.firstChild){
            userList.firstChild.remove()
        }

        fetch(`https://api.github.com/search/users?q=${user}`,{
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                Accept: 'application/vnd.github.v3+json'
            }
        })
        .then(res => res.json())
        .then(data => {
            console.log(data.items)
            let workingArr = data.items
            workingArr.forEach(element => {

                //create DOM elements to display
                let img = document.createElement('img')
                let p = document.createElement('p')
                let aTag = document.createElement('a')
                let li = document.createElement('li')

                //set element properties to GET data
                p.innerText = `Username: ${element.login}`
                img.src = element['avatar_url']
                aTag.href = element['html_url']
                aTag.innerText = `Click here to see profile`
                aTag.style.display = 'block'

                //add eventListener for repoClick
                p.addEventListener('click', e => repoClick(e))

                //append to the DOM
                li.append(p, aTag, img)
                userList.append(li)
            });
        })
    }

    const repoClick = (e) => {
        let loginname = e.target.innerText.split(" ").slice(-1)
        const fetchObj = {
            method:'GET',
            headers:{
                'Content-type': 'application/json',
                Accept: 'application/vnd.github.v3+json'
            }
        }
        fetch(`https://api.github.com/users/${loginname}/repos`, fetchObj)
        .then(res => res.json())
        .then(data => {
            console.log(data)
                let newelements = data.map((element) => {
                    return `
                    <a href=${element['html_url']}/><li>${element.name}</li></a>
                    `
                })
                repoList.innerHTML = newelements.join("")
            })
        }
    })