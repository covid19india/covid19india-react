import React, {useState, useEffect} from 'react';

function Banner(props) {
  return (
    <div className="Banner fadeInUp" style={{animationDelay: '0.5s'}}>
      <marquee>
        <span>India in Lockdown: Dont Hoard groceries and essentials! They will be available throughout! Please ensure that people who are really in need don't face a shortage because of you!</span>

        <span>Be compassionate! This is a testing time for every one of us! Help those in need like the elderly and poor. They are facing a crisis you cannot even imagine! They don't have food for today let alone the next 21 days. Help them out and please leave essentials for them too!</span>

        <span>Be considerate: While buying essentials remember : you are buying dinner for the next month whereas the other 130 Crore Indians don't have food for dinner TONIGHT! Take ONLY the bare minimum you need.</span>

        <span>Going out to buy essentials? Social Distancing is KEY! Maintain 2 metres distance between each other in the line. You never know who has the virus and you do not want to spread it to the more vulnerable.</span>

        <span>Plan ahead! Take a minute with your family, sit down and discuss your status with essentials. Plan meals for the next three weeks so that you buy exactly how much is needed. If you don't plan now, you'll end up risking yourself or others!</span>

        <span>Plan and calculate your essential needs for the next three weeks and get only what is bare minimum needed. We are in times of a crisis and need to share what we have with 130 Crore Indians! DO NOT HOARD.</span>

        <span>Help out the elderly by bringing them their groceries and other essentials. Ensure you leave it at their doorstep and take enough measures to not spread anything you may have to them!</span>

        <span>Help out the poor by not cutting their salaries. Help out of they reach out for advance payments or for food. We need to be compassionate in the true spirit of being Indian!</span>

        <span>Lockdown means LOCKDOWN! Avoid going out unless absolutely necessary. Stay safe!</span>

        <span>Panic mode:OFF! ESSENTIALS ARE ON!  1</span>

        <span>Do not panic! Your essential needs will be taken care of! ALL ESSENTIALS LIKE FOOD, WATER, ETC ARE ON!</span>

        <span>Corona brings us a time where we need to be together in the true spirit of being Indian. Show compassion. Be considerate. Help those in need. We will get through this!</span>

        <span>If you have symptoms and suspect you have coronavirus - reach out to your doctor or call 104. Get help.</span>

        <span>Stand Against FAKE News and WhatsApp Forwards! Do NOT forward a message until you verify the content it contains. Refer ONLY govt websites and notifications.</span>

        <span>If you have any queries, Reach out to your district administration or doctors!</span>
      </marquee>
    </div>
  );
}

export default Banner;
