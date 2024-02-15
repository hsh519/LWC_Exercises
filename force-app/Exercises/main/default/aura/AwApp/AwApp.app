<aura:application extends="force:slds">
	<aura:attribute name="listView" type="String" default="visible" />
	<aura:attribute name="markersTitle" type="String" default="All Worldwide Deliveries" />

	<lightning:layout class="slds-var-p-around_medium" multipleRows="true">
		<lightning:layoutItem size="12" class="slds-align_absolute-center slds-var-m-bottom_x-small">
			<div class="slds-text-heading_large">AwApp</div>
		</lightning:layoutItem>

		<lightning:layoutItem size="12" smallDeviceSize="12" mediumDeviceSize="3">
			<lightning:card iconName="utility:description" title="Attribute Debugger" class="slds-var-m-horizontal_medium">
				<div class="slds-var-p-around_medium">listView: {!v.listView} <BR /> markersTitle: {!v.markersTitle} <BR /></div>
			</lightning:card>
			<div class="slds-var-m-around_medium slds-var-p-around_medium">This page is built using an aura:application.</div>
		</lightning:layoutItem>
		<lightning:layoutItem size="12" smallDeviceSize="12" mediumDeviceSize="9">
			<c:deliveryListMap listView="{!v.listView}" markersTitle="{!v.markersTitle}" />
		</lightning:layoutItem>
	</lightning:layout>
</aura:application>
