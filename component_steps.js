import { createOptimizedPicture } from './scripts/aem.js';
import { subscribe } from './blocks/form/rules/index.js';

/* ================= CREATE CARD ================= */

function createCard(element, fieldJson, enums) {
  const updatedEnums = enums
    || fieldJson.enumNames.map((e) => ({
      ...e,
      benefits: 'benefits1,benefits2',
    }));

  element.querySelectorAll('.radio-wrapper').forEach((radioWrapper, index) => {
    const current = updatedEnums[index];

    if (current?.name) {
      let label = radioWrapper.querySelector('label');
      if (!label) {
        label = document.createElement('label');
        radioWrapper.appendChild(label);
      }
      label.textContent = current.name;
    }

    const input = radioWrapper.querySelector('input');
    if (input) input.dataset.index = index;

    const image = createOptimizedPicture(
      current?.image
        || 'https://main--afb--jalagari.hlx.page/lab/images/card.png',
      'card-image',
    );

    const benefitsUl = document.createElement('ul');
    benefitsUl.className = 'card-choice-benefits-list';

    const benefits = current?.benefits
      ?.split(',')
      ?.map((b) => b.trim())
      ?.filter(Boolean);

    benefits?.forEach((benefit) => {
      const li = document.createElement('li');
      li.textContent = benefit;
      benefitsUl.appendChild(li);
    });

    radioWrapper.appendChild(image);
    radioWrapper.appendChild(benefitsUl);
  });
}

/* ================= MAIN DECORATOR ================= */

export default function decorate(fieldDiv, fieldJson, formId, fieldModel) {
  // Step 1: View
  createCard(fieldDiv, fieldJson);
  fieldDiv.classList.add('card');

  // Step 2: Model → View
  subscribe(fieldDiv, formId, (div, fieldModelInner) => {
    fieldModelInner.subscribe((e) => {
      const { payload } = e;

      payload?.changes?.forEach((change) => {
        if (change?.propertyName === 'enum') {
          createCard(fieldDiv, fieldJson, change.currentValue);
        }
      });
    });
  });

  // Step 3: View → Model
  fieldDiv.addEventListener('change', (e) => {
    e.stopPropagation();

    const index = parseInt(e.target.dataset.index, 10);
    const value = fieldModel.enum?.[index];

    fieldModel.value = value?.name;
  });
}
