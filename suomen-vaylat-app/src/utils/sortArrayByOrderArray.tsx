export default function sortArrayByOrderArray(arr: any[], orderArray: string | any[]) {
    return arr.sort(function(e1, e2) {
        return orderArray.indexOf(e1.id) - orderArray.indexOf(e2.id);
    });
}