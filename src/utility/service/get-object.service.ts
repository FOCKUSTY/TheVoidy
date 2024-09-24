import Loader from "loaders/data/objects.loader";

const objects = new Loader().execute();

const GetObject = (type: 'name'|'idea'|'download') => {
    switch (type) {
        case 'name':
            return objects.name;

        case 'download':
            return objects.download;

        case 'idea':
            return objects.idea;
    
        default:
            return objects.idea;
    };
};

export default GetObject;