const React = require('react')

const ListItem = (props) => {
  //props = {item: 'hi', myname: 'dave'}


  return <div>{props.item}</div>
}


const MyComponent = (props) => {
  const {items} = props



  return (
    <div className="shopping-list">
      <h1>Shopping List for {props.name}</h1>
      <ul>
        {items.map(item => <ListItem item={item} />)}
      </ul>
    </div>
  );
}

//react.render(MyComponent, document.getElementById('dontationcontainer'))

exports.MyComponent = MyComponent

