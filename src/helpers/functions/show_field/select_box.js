export default (data, row, field ,props) => {
  return props.getFromStore(field.app,data).name

}
