const TableWrapper = ({ children }) => {
  return (
    <div className="w-full overflow-x-auto">
      <table>{children}</table>
    </div>
  )
}
TableWrapper.displayName = 'TableWrapper'
export default TableWrapper
