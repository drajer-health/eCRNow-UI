import React from "react";
import { Form, Row, Col } from "react-bootstrap";
import { FormInputGroupProps } from "../../src/Models/PublicHealthAuthority.model";

const FormInputGroup: React.FC<FormInputGroupProps> = ({ label, name, placeholder, value, onChange, isInvalid, feedback, type = "text", required = true, as = "input", rows, min,
}) => (
    <Form.Group as={Row} controlId={`formHorizontal${name}`}>
        <Form.Label column sm={2}>
            {label}
        </Form.Label>
        <Col sm={10}>
            <Form.Control
                as={as}
                type={type}
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                    if (
                        type === "number" &&
                        min !== undefined &&
                        e.target.value !== "" &&
                        !isNaN(parseFloat(e.target.value)) &&
                        parseFloat(e.target.value) < min
                    ) {
                        const target = { ...e.target, value: String(min) };
                        const syntheticEvent = {
                            ...e,
                            target,
                        } as React.ChangeEvent<HTMLInputElement | HTMLSelectElement>;
                        onChange(syntheticEvent);
                        return;
                    }
                    onChange(e);
                }}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (type === "number" && e.key === "-") {
                        e.preventDefault();
                    }
                }}
                required={required}
                isInvalid={isInvalid}
                rows={rows}
                min={min}
            />
            <Form.Control.Feedback type="invalid">
                {feedback}
            </Form.Control.Feedback>
        </Col>
    </Form.Group>
);

export default FormInputGroup;