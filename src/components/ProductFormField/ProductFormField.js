import styles from './ProductFormField.module.scss';

function camelize(text) {
  return text?.replace(/(?:^|_)([a-z])/g, ($0, $1) => $1.toUpperCase());
}

export default function ProductFormField({ field }) {
  const FieldType = fieldTypes[camelize(field.type)];
  console.log({ label: field.display_name, field });
  
  const id = `attribute_${field.type}_${field.id}`;
  const name = `attributes[${field.id}]`;
  const required = field.required === true || field.prodOptionType === 'variant';
  
  return (
    FieldType
    ? <FieldType field={field} id={id} name={name} required={required} />
    : null /*<div>[{field.type}]</div>*/
  );
}

function Field({ field, id, required, grouped, children, ...props }) {
  const groupId = `${field.type}_group_${field.id}`;

  const labelProps = {};
  if (grouped === true) {
    labelProps.id = groupId;
  } else if (id) {
    labelProps.htmlFor = id;
  }
  
  return (
    <div
      className={styles.formField}
      {...(grouped ? { 'aria-labelledby': groupId, role: 'radiogroup' } : {})}
      {...props}
    >
      <label
        className={styles.formLabel}
        {...labelProps}
      >
        {field.display_name}: <small>{required ? '(Required)' : 'Optional'}</small>
      </label>
      {children}
    </div>
  );
}

const fieldTypes = {
  Swatch({ field, id, required, name }) {
    return (
      <Field field={field} id={id} required={required} grouped>
        {field.option_values.map((value, index) => {
          const id = `attribute_swatch_${field.id}_${value.id}`;
          
          return (
            <div className={styles.formOptionWrapper} key={value.id}>
              <input
                type="radio"
                name={name}
                value={value.id}
                id={id}
                aria-label={value.label}
                defaultChecked={value.is_default}
              />
              <label htmlFor={id} className={styles.formOption}>
                {value.value_data?.colors?.map((color, index) => (
                  <span title={value.label} className={styles.formOptionVariant + ' ' + styles.formOptionVariantColor} style={{ backgroundColor: color }} key={index} />
                ))}
                {
                  value.value_data?.image_url
                  ? <span title={value.label} className={styles.formOptionVariant + ' ' + styles.formOptionVariantPattern} style={{ backgroundImage: `url('${value.value_data.image_url}')` }} />
                  : null
                }
              </label>
            </div>
          );
        })}
      </Field>
    );
  },
  RadioButtons({ field, id, name, required }) {
    return (
      <Field field={field} id={id} required={required} grouped>
        {field.option_values.map((value, index) => (
          <label htmlFor={`attribute_radio_${field.id}_${value.id}`} className={styles.radioLabel} key={index}>
            <input
              type="radio"
              name={name}
              id={`attribute_radio_${field.id}_${value.id}`}
              value={value.id}
              defaultChecked={value.is_default}
            />
            {value.label}
          </label>
        ))}
      </Field>
    );
  },
  Rectangles({ field, id, name, required }) {
    return (
      <Field field={field} id={id} required={required} grouped>
        {field.option_values.map((value, index) => {
          const id = `attribute_rectangle_${field.id}_${value.id}`;
        
          return (
            <div className={styles.formOptionWrapper} key={value.id}>
              <input
                type="radio"
                name={name}
                value={value.id}
                id={id}
                aria-label={value.label}
                defaultChecked={value.is_default}
              />
              <label htmlFor={id} className={styles.formOption + ' ' + styles.formOptionRectangle}>
                <span title={value.label} className={styles.formOptionVariant}>{value.label}</span>
              </label>
            </div>
          );
        })}
      </Field>
    );
  },
  Text({ field, id, required }) {
    return (
      <Field field={field} id={id} required={required}>
        <input
          type="text"
          name={`attributes[${field.id}]`}
          id={id}
          required={required}
          minLength={field.config?.text_min_length}
          maxLength={field.config?.text_max_length}
          defaultValue={field.config?.default_value}
        />
      </Field>
    );
  },
  Dropdown({ field, id, name, required }) {
    return (
      <Field field={field} id={id} required={required}>
        <select name={name} id={id} required={required} defaultValue={defaultValue(field)}>
          <option value="">Choose Options</option>
          {field.option_values.map((value, index) => (
            <option value={value.id} key={index}>{value.label}</option>
          ))}
        </select>
      </Field>
    );
  },
  MultiLineText({ field, id, required }) {
    return (
      <Field field={field} id={id} required={required}>
        <textarea
          type="text"
          name={`attributes[${field.id}]`}
          id={id}
          required={required}
          minLength={field.config?.text_min_length}
          maxLength={field.config?.text_max_length}
          defaultValue={field.config?.default_value}
        />
      </Field>
    );
  },
  Checkbox({ field, id, name, required }) {
    return (
      <Field field={field} required={required}>
        <input type="hidden" name={name} value={field.option_values[1].id} />
        <label htmlFor={`attribute_check_${field.id}`} className={styles.radioLabel}>
          <input
            type="checkbox"
            name={name}
            id={`attribute_check_${field.id}`}
            value={field.option_values[0].id}
            defaultChecked={field.config?.checked_by_default}
          />
          {field.config?.checkbox_label}
        </label>
      </Field>
    );
  },
  NumbersOnlyText({ field, id, name, required }) {
    return (
      <Field field={field} id={id} required={required}>
        <input
          type="number"
          name={name}
          id={id}
          required={required}
          min={field.config?.number_lowest_value}
          max={field.config?.number_highest_value}
          defaultValue={field.config?.default_value}
        />
      </Field>
    );
  },
  Date({ field, id, name, required }) {
    const currentYear = new Date().getFullYear();
    const latestDate = field.config?.date_latest_value;
    const latestYear = (
      latestDate
      ? new Date(latestDate).getFullYear()
      : currentYear + 20
    );
    const yearOptions = [];
    for (var i = currentYear; i <= currentYear; i += 1) {
      yearOptions.push(i);
    }
    
    const defaultValue = field.config?.default_value;
    const defaultDate = (
      defaultValue
      ? new Date(defaultValue)
      : null
    );
    
    return (
      <Field field={field} id={id} required={required}>
        <select name={`${name}[month]`} defaultValue={defaultDate?.getMonth() + 1}>
          <option value="">Month</option>
          {months.map((option, index) => (
            <option value={option.value} key={option.value}>{option.label}</option>
          ))}
        </select>
        <select name={`${name}[day]`} defaultValue={defaultDate?.getDate()}>
          <option value="">Day</option>
          {Array.apply(null, Array(31)).map((_, index) => index + 1).map((day, index) => (
            <option value={day} key={day}>{day}</option>
          ))}
        </select>
        <select name={`${name}[year]`} defaultValue={defaultDate?.getFullYear()}>
          <option value="">Year</option>
          {yearOptions.map((year) => (
            <option value={year} key={year}>{year}</option>
          ))}
        </select>
      </Field>
    );
  },
  File({ field, id, name, required }) {
    return (
      <Field field={field} id={id} required={required}>
        <input type="file" name={name} id={id} />
      </Field>
    );
  },
};

function defaultValue(field) {
  return field.option_values.filter((value) => value.is_default )?.[0]?.id;
}

const months = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ').map((month, index) => ({
  value: index + 1,
  label: month,
}));
