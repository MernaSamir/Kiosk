import applyFilters from 'helpers/functions/filters'

test ("Find",()=>{
    const data = applyFilters({
        key: 'Find',
        path: 'dropdowns__delivery_service_mode',
        params: {
            service: 'ub',
        }})
    
    const hq ={     
        "id": "054c512c-4885-4ea9-891d-538321b80ce2",
        "created_at": "2019-09-29T10:11:08.463824Z",
        "updated_at": "2019-09-29T10:11:08.463824Z",
        "service": "ub",
        "mode": "pickup"      
    }
      expect(data).toBe(hq); 
      
 });
