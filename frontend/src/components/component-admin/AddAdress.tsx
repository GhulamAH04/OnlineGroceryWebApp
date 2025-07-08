/* eslint-disable react-hooks/exhaustive-deps */
import { addAddress, getAddress, getCity, getProvince } from '@/api/address';
import { getCookies } from '@/helper/helper';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa';

export default function AddAddress({
  setAddAddress,
}: {
  setAddAddress: (value: boolean) => void;
}) {
  const cookies = getCookies();
  const [province, setProvince] = useState([]);
  const [city, setCity] = useState([]);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    message: string;
    status: string;
  }>({ message: '', status: '' });
  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    const fetchProvince = async () => {
      try {
        const res = await getProvince();
        setProvince(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    const fetchCity = async (provinceId: number) => {
      try {
        const res = await getCity(provinceId.toString());
        setCity(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProvince();
    const provinceId = watch('provinceId');
    if (provinceId) {
      fetchCity(provinceId);
    } else {
      setCity([]);
    }
  }, [watch, watch('provinceId')]);

  const onSubmit = async (data: any, event: any) => {
    try {
      data = {
        ...data,
        userId: Number(cookies.userId),
        longitude: 0,
        latitude: 0,
      };
      const response = await addAddress(data);
      showToast(response);
      setTimeout(() => {
        reset();
        setAddAddress(false);
        window.location.reload();
      }, 3000);
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  const showToast = (data: { message: string; status: string }) => {
    setToastMessage(data);
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  return (
    <form>
      {toastVisible && (
        <div
          className="toast toast-top toast-end"
          style={{
            position: 'fixed',
            top: '3rem',
            right: '1rem',
            zIndex: 1000,
          }}
        >
          <div
            className={`alert ${toastMessage.status === 'success' ? 'alert-success' : 'alert-error'}`}
          >
            <span className="text-primary text-bold">
              {toastMessage.message}
            </span>
          </div>
        </div>
      )}
      <div className="md:grid">
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Name</span>
          </div>
          <input
            type="text"
            placeholder="Name"
            className="input input-bordered"
            {...register('name', { required: true })}
          />
          {errors.name && (
            <span className="text-red-500">This field is required</span>
          )}
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Province</span>
          </div>
          <select
            className="select select-bordered"
            {...register('provinceId', { required: true })}
            defaultValue=""
          >
            <option value="" disabled>
              Pick one
            </option>
            {province.map((prov: { id: string; name: number }) => (
              <option key={prov.id} value={prov.id}>
                {prov.name}
              </option>
            ))}
          </select>
          {errors.provinceId && (
            <span className="text-red-500">This field is required</span>
          )}
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">City</span>
          </div>
          <select
            className="select select-bordered"
            {...register('cityId', { required: true })}
            defaultValue=""
          >
            <option value="" disabled>
              Pick one
            </option>
            {city.map((c: { id: string; name: number }) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.cityId && (
            <span className="text-red-500">This field is required</span>
          )}
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Address</span>
          </div>
          <input
            type="text"
            placeholder="Address"
            className="input input-bordered"
            {...register('address', { required: true })}
          />
          {errors.address && (
            <span className="text-red-500">This field is required</span>
          )}
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text">Postal Code</span>
          </div>
          <input
            type="text"
            placeholder="Postal Code"
            className="input input-bordered"
            {...register('postalCode', { required: true })}
          />
          {errors.postalCode && (
            <span className="text-red-500">This field is required</span>
          )}
        </label>
        <button
          type="submit"
          className="btn btn-success my-4"
          onClick={handleSubmit(onSubmit)}
        >
          <FaPlus /> Submit
        </button>
      </div>
    </form>
  );
}
