const row_types = ["grass", "roadtype"];

const initial_size = 10;
const maxRows = 20;

const internal_limit = 100;
export const globalMap_Limit = 50;

const initGlobalMap = () => {
    const globalMap = [
    ];

    for (let i = 0; i < globalMap_Limit; i++) {
        let randomIndex = Math.floor(Math.random() * row_types.length);
        if (i < initial_size) {
            randomIndex = 0;
        } else if( i < initial_size +3) {
            randomIndex = 1;
        }
        const randomRowType = row_types[randomIndex];


        let randVal = Math.floor(Math.random() * internal_limit)+1;

        let randValArray = [];
        let cnt =  Math.floor(Math.random() * 2) + 1;
        for( let j = 0 ; j < cnt ; j ++) {
            randValArray.push(Math.floor(Math.random() * internal_limit) + 1)
        }

        globalMap.push({ id: i, row_type: randomRowType , randVal : randVal, randValArray : randValArray});
    }

    return globalMap;
};

// Call the function to initialize globalMap
export const globalMap = initGlobalMap();
console.log("GLOBAL MAP::::::::::::::", globalMap);
