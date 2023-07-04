function isUUID(uuid: string) {
  const sizeUUID = [8, 4, 4, 4, 12];
  const arrUUID = uuid.split('-');
  return (
    arrUUID.length === 5 && arrUUID.map((el, index) => sizeUUID[index] === el.length).reduce((acc, cur) => acc && cur)
  );
}

export default isUUID;
