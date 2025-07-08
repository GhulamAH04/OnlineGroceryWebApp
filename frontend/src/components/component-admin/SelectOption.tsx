export default function SelectOption({
  label,
  field,
  options,
  register,
}: {
  label: string;
  field: string;
  options: any[];
  register: any;
}) {
  return (
    <div className="md:grid gap-4">
      <label className="form-control w-full">
        <div className="label">
          <span className="label-text">{label}</span>
        </div>
        <select className="select select-bordered" {...register(field)}>
          <option disabled selected>
            Pick one
          </option>
          {options?.map((option) => (
            <option
              key={option.id}
              value={
                field === 'courier'
                  ? option.id
                  : field === 'addressId'
                    ? option.id
                    : option.name
              }
            >
              {option.name} {option?.address && `| ${option?.address}`}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
