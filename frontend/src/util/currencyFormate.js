export const indianRupee=(amount)=>{
    let rupee = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'INR',
    });
    return rupee.format(amount);
}