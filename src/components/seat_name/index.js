import applyFilters from 'helpers/functions/filters'

export const seat=(seat_num, order, pre)=>{
    const seat = applyFilters({
        key:'Find',
        path: 'orders__order_seats',
        params: {
            order,
            seat_num
        }
    })
    if (seat){
        if(seat.customer){
          const customer = applyFilters({path:`parties__customer.data.${seat.customer}`})
          return `S${seat.seat_num} ${customer.name}`
              
              }
        else {
          return `S${seat.seat_num} ${seat.note}`
        }
      }
    else{
        return `${pre} ${seat_num}`
    }

}